import React /*,{useEffect, useState}*/ from 'react';
import { Card, Image, Header, Label} from "semantic-ui-react";
import {Bar} from 'react-chartjs-2';

import weaknessIcon from '../assets/images/weakness.png';

function StatisticsProgress (props){
/*  //unused
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
      setLoaded(true);
  }, []);
*/
  const data = {
    labels: props.dta.labels,
    datasets: props.dta.datasets
  }
  
  /*const data = {
    labels: ['Wed', 'Thu', 'Fri', 'Sat', 'Mon', 'Tue'],
    datasets: [
        {
        label: 'Easy',
        data: [14, 18, 90, 70, 20, 0, 7],
        backgroundColor: "#f8c410",
        },
        {
        label: 'Medium',
        data: [0, 18, 0, 70, 0, 0, 50],
        backgroundColor: "#78909c",
        },
        {
        label: 'Hard',
        data: [40, 14, 0, 40, 0, 2, 64],
        backgroundColor: "#803843",
        }
    ]
    }*/

      
const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            userCallback: function(label, index, labels) {
              // when the floored value is the same as the value we have a whole number
              if (Math.floor(label) === label) {
                  return label;
              }
            }
          },
        },
      ],
    },
  }

return (
        <>
        <Header textAlign='center' style = {{color:"#3d7f98", fontSize:"155%"}}>Practiced exercises in last week
        </Header>
        <Bar width={80} height={50} data={data} options={options}/>
        
        <Card fluid>
            <Card.Content textAlign="center">
                <Card.Header>
                    <Header as='h2' textAlign="center">
                    <Image src={weaknessIcon} /> 
                        <Header.Content style = {{color:"#3d7f98"}}>
                          Your weakest passages
                          <h6>We included them in "Hard" type of exercises.</h6>
                        </Header.Content>
                            
                    </Header>
                </Card.Header>
                <Card.Description>
                    <Label tag style={{marginBottom:"1em"}}>Minor Third</Label>  
                    <Label tag style={{marginBottom:"1em"}}>G minor Triad</Label>  
                    <Label tag style={{marginBottom:"1em"}}>Diminished Fifth</Label>
                    <Label tag style={{marginBottom:"1em"}}>Dominant Seventh</Label>
                </Card.Description>
                <Header.Subheader>

                </Header.Subheader>
            </Card.Content>
        </Card>

        </>
    );
}

export default StatisticsProgress;