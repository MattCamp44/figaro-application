const express = require('express');
const bodyParser = require('body-parser');
const formData = require('express-form-data');
const app = express();
const port = process.env.PORT || 3001;
const db = require('./database');
const path = require('path');
const fs = require('fs');

app.use(formData.parse({ uploadDir: path.join(__dirname), autoClean: true }));
app.use(formData.stream());     /* change the file objects to fs.ReadStream        */
app.use(bodyParser.json());     /* only accept requests with a JSON formatted body */

if (process.env.NODE_ENV !== 'production')
  app.use(require('morgan')('dev'));  /* log incoming requests to console                */
app.use(express.static(path.join(__dirname, 'client/build'))); /* Serve static files from the React app */

app.get(`/api/user`, (req, res) => {
  res.json(db.get('user').value());
});

/* update the voice type. Checks on gender are performed */
app.patch(`/api/user`, (req, res) => {
  const { voice } = req.body;
  const gender = db.get('user.gender').value();

  // check if user's gender and requested voice type are compatible
  if (db.get(`voices.${gender.toLowerCase()}`).includes(voice).value()) {
    db.set('user.voice', voice).write();
    res.json({ 'message': 'voice type updated successfully' });
  } else {
    res.status(400).json({ 'message': 'failed in updating voice type' });
  }
});

/* return voice ranges for specified gender */
app.get(`/api/voices`, (req, res) => {
  const { gender } = req.query;
  const voices = db.get(`voices.${gender.toLowerCase()}`).value();
  res.json(voices);
});

app.get(`/api/exercises`, (req, res) => {
  res.json(db.get('exercises').value());
});

app.get(`/api/exercises/:id`, (req, res) => {
  const { id } = req.params;
  const exercise = db.get('exercises').getById(id).value();
  return exercise
    ? res.json(exercise)
    : res.status(404).end();
});

app.patch(`/api/exercises/:id`, (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const exercise = db.get('exercises').updateById(id, { favorite }).write();
  return exercise
    ? res.json(exercise)
    : res.status(404).end();
});

app.post(`/api/exercises`, (req, res) => {
  const { name, difficulty, notes } = req.body;
  const newExercise = db.get('exercises').insert({ name, difficulty, notes }).write();
  res.status(201).json(newExercise);
});

/*  Returns a test picked from the available, based on some logic.  *
 *  A test is meant to be represented as a list of exercises.       */
app.get(`/api/test`, (req, res) => {
  /* Logic = random test */
  res.json(db.get('tests').shuffle().first().map(id => db.get('exercises').getById(id)).value());
});

/*  Returns the history of statistics related to test exercises     */
app.get(`/api/statistics`, (req, res) => {
  const join = (data) => {
    const { id, ...exercise } = exercises.find(ex => ex.id === data.exercise);
    return { ...data, exercise };
  };

  const exercises = db.get('exercises').value();
  const data = db.get('statistics').map(join).value();

  res.json(data);
});

/* Updates Statistics (adds score data of an exercise) */
app.put(`/api/statistics/:id`, (req, res) => {
  const { id } = req.params;
  const { date, percentage } = req.body;
  
  // create new if there is no record of the exercise in stats

  const found = db.get('statistics').getById(id).value();
  if (!found) {
    const ex = db.get('exercises').getById(id).value();
    db.get('statistics').push({
      "exercise": `${ex.id}`,
      "id": `${ex.id}`,
      "name": ex.name,
      "difficulty": ex.difficulty,
      "scores": [
        { date, percentage }
      ]
    }).write();
  } else {
    const stats = db.get('statistics').getById(id);
    stats.get('scores').push({ date, percentage }).write();
  }

  res.json ({'status':200});
});

/*  Returns the user avatar */
app.get(`/api/avatar`, (req, res) => {
  res.sendFile(path.join(__dirname, 'avatar.png'));
});

/*  Updates the user avatar           *
 *  Returns the newly updated image   */
app.put(`/api/avatar`, (req, res) => {
  const { path } = req.files.file;
  fs.rename(path, 'avatar.png', function (err) {
    res.json({ 'message': 'uploaded successfully' });
  });
});

/* The "catchall" handler: for any request that doesn't *
 * match one above, send back React's index.html file.  */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});