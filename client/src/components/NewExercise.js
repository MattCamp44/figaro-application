import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Header, Icon, Modal } from 'semantic-ui-react';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';

import pageTitleContext from "../context/pageTitleContext";
import { Button } from 'semantic-ui-react';
import * as API from "../API";

export default function NewExercise(props) {
  
  // define variables
  const buflen = 2048;
  const buf = new Float32Array(buflen);
  const noteStrings = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];
  const noteFrequency = [ 261.62, 277.18, 293.66, 311.12, 329.62, 349.22, 369.99, 391.99, 415.30, 440.00, 466.16, 493.88 ]
  const { id } = useParams();
  const tempo = 400;

  const NBaseNoteRepetitions = props.doneFetching ? props.exercises.find(ex => ex.id === id)["repetitions"] : null;
  const pattern = props.doneFetching ? props.exercises[id - 1].pattern : null;
  const { setPageTitle } = useContext(pageTitleContext);

  let context;
  let waveAnalyzer;
  let oscillator;
  let sungNotes = [];

  useEffect(() => {
    setPageTitle(props.doneFetching ? props.exercises.find(ex => ex.id === id)["name"] : "");

    //need to do this to "open" the channel
    const tempglobalpattern = [];
    for (let i = 0; i < NBaseNoteRepetitions; i++) {
      for (let k = 0; k < pattern.length; k++) {
        tempglobalpattern[(i * pattern.length) + k] = noteStrings[(pattern[k] + i) % 12];
      }
    }
    setGlobalPattern(tempglobalpattern);
  }, [ props.doneFetching ]);

  // define state
  const [ openModal, setOpenModal ] = useState(false);
  const [ percentage, setPercentage ] = useState(-1);
  const [ globalPattern, setGlobalPattern ] = useState([]);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ sing, setSing ] = useState(false);


  // define functions
  async function saveScore(id, data) {
    try {
      await API.setStatistics(id, data);
    } catch (err) { }
  }

  function setCirclePercentage (perc) {
    const node = document.getElementById("control-button");
    if (node) {
      node.style.backgroundImage
        = "linear-gradient(left, #568690, #568690 " + perc + "%, #77a4ad " + perc + "%, #77a4ad)";
      node.style.backgroundImage
        = "-moz-linear-gradient(left, #568690, #568690 " + perc + "%, #77a4ad " + perc + "%, #77a4ad)";
      node.style.backgroundImage
        = "-webkit-linear-gradient(left, #568690, #568690 " + perc + "%, #77a4ad " + perc + "%, #77a4ad)";
    }
  }

  async function setupAudio() {
    context = new (window.AudioContext || window.webkitAudioContext)();
    waveAnalyzer = context.createAnalyser();

    const audio = await getAudio();
    if (context.state === 'suspended') {
      await context.resume();
    }

    const source = context.createMediaStreamSource(audio);
    source.connect(waveAnalyzer);
  }

  async function getAudio() {
    return navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          latency: 0
        }
      }
    )
  }

  function noteFromPitch(frequency) {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
  }

  function autoCorrelate(buf, sampleRate) {
    // Implements the ACF2+ algorithm
    let SIZE = buf.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) {
      //console.log("Not enough signal");
      //console.log(rms);
      return -1;
    } // not enough signal

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++)
      if (Math.abs(buf[i]) < thres) {
        r1 = i;
        break;
      }
    for (let i = 1; i < SIZE / 2; i++)
      if (Math.abs(buf[SIZE - i]) < thres) {
        r2 = SIZE - i;
        break;
      }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE - i; j++)
        c[i] = c[i] + buf[j] * buf[j + i];

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }

  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function playNote(note, tempo) {
    oscillator = context.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(note, context.currentTime); // value in hertz
    oscillator.connect(context.destination);

    oscillator.start();
    await sleep(tempo);
    oscillator.stop();
  }

  async function playNoteSing(note, tempo) {
    await playNote(note, tempo);
    const note_value = getNote();
    const note_string = isNaN(note_value) ? "0" : noteStrings[note_value];

    // store note for final error check
    sungNotes.push( note_string );

    setCirclePercentage(((sungNotes.length / globalPattern.length) * 100));

    return note_string;
  }

  async function playMetronome(n = 4) {
    const noteLength = 80, noteFreq = 40;

    for (let i = 0; i < n; i++) {
      await playNote(noteFreq, noteLength);
      await sleep(800);
    }
  }

  function getNote() {
    waveAnalyzer.getFloatTimeDomainData(buf);
    return noteFromPitch(autoCorrelate(buf, context.sampleRate)) % 12;
  }

  async function playRepetition(notes) {
    for (let i = 0; i < notes.length; i++) {
      await playNote(noteFrequency[notes[i]], tempo);
      await sleep(tempo);
    }
  }

  async function playRepetitionSing(notes) {
    for (let i = 0; i < notes.length; i++) {
      const node = document.getElementById("notes-sequence")?.children[i];
      node?.classList.add("actual-playing");
      const sungNote = await playNoteSing(noteFrequency[notes[i]], tempo);
      await sleep(tempo);
      node?.classList.remove("actual-playing");
      node?.classList.add("past-played", node.innerText !== sungNote ? "wrong-played" : "well-played");
    }
  }

  const checkError = () => {
    if (globalPattern.length !== sungNotes.length) return;

    let Nerrors = 0;
    for (let i = 0; i < globalPattern.length; i++)
      if (globalPattern[i] !== sungNotes[i])
        Nerrors++;

    setPercentage(Math.floor(((1 - (Nerrors / globalPattern.length)) * 100)));

    //SAVE SCORE 
    saveScore(id, {
      "date": new Date().toISOString(),
      "percentage": Math.floor(((1 - (Nerrors / globalPattern.length)) * 100))
    })

  }
  
  async function playExercise() {
    await setupAudio();
    setIsPlaying(true);

    // Play metronome 1234
    await playMetronome();

    const tempPattern = [ ...pattern ];

    let node;
    node = document.getElementById("render");
    if (node) node.innerText = NBaseNoteRepetitions + " repetitions";

    for (let i = 0; i < NBaseNoteRepetitions; i++) {
      for (let k = 0; k < pattern.length; k++) {
        // shift note for this repetition
        tempPattern[k] = (pattern[k] + i) % 12;
      }
      const tempPatternString = tempPattern.map((item) => noteStrings[item]);

      node = document.getElementById("notes-sequence");
      if (node) node.innerHTML = tempPatternString.map(note => `<span>${note}</span>`).join("");

      // first listen the pattern
      await playRepetition(tempPattern);

      // then sing while listening
      setSing(true);
      await playMetronome(1);
      await playRepetitionSing(tempPattern);
      setSing(false);

      node = document.getElementById("render");
      if (node) node.innerText = i + 1 + "/" + NBaseNoteRepetitions + " repetitions";

      await playMetronome(1);
    }

    checkError();
    setIsPlaying(false);
  }

  // render
  return (
    <>
      <div id="notes-sequence"/>

      <div id="control-button" onClick={() => {
        if (!isPlaying) playExercise();
        else            window.location.reload();
      }}>
        <div>
          {
            isPlaying
              ? <h1> {sing ? "Sing!" : "Listen"} </h1>
              : percentage >= 0
              ? <h1> Result {percentage}% </h1>
              : <Icon id="play-icon" size="huge" name='play'/>
          }
        </div>
      </div>

      <div className="repetitions">
        {
          isPlaying
            ? <>
              <a id="stop-exercise" onClick={() => {
                window.location.reload();
              }}> Tap to stop the exercise </a>
              <div id="render"/>
            </>
            : <div id="tutorial-button" onClick={() => {
              setOpenModal(true);
            }}>?</div>
        }
      </div>
      
      <Modal
        basic
        onClose={() => setOpenModal(false)}
        onOpen={() => setOpenModal(true)}
        open={openModal}
        size='small'
      >
        <Header textAlign='center'>
          <h2>How to run the exercise</h2>
        </Header>
        <Modal.Content style={{ marginTop: '4ex' }}>
          <AwesomeSlider
            media={[
              {
                source: '/figaro_tutorial1.png',
              },
              {
                source: 'https://github.com/polito-hci-2020/figaro-code/blob/user-interface/database/assets/images/figaro_tutorial1.png',
              },
              {
                source: 'https://github.com/polito-hci-2020/figaro-code/blob/user-interface/database/assets/images/figaro_tutorial1.png',
              },
            ]}
            organicArrows={true}
            bullets={true}
            infinite={false}
            buttons={true}
          >
          </AwesomeSlider>
        </Modal.Content>
        <Modal.Actions style={{
          bottom: '5%',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          <Button basic color='red' inverted onClick={() => setOpenModal(false)}>
            <Icon name='remove'/> Close Tutorial
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );

}
