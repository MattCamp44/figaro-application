import React /*,{useEffect, useState}*/ from 'react';
import {Header, Button, List, Grid, Icon} from "semantic-ui-react";
import Doughnut from 'react-chartjs-2';
import {useHistory} from 'react-router-dom';
import moment from 'moment';


function StatisticsDetails (props){
/*  //unused
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);
*/
    const history = useHistory();
    const scoreBenchmark = 69;

    const options = {
      aspectRatio: 2,
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            }
        },
        responsive: false,
        cutoutPercentage: 50,
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
        tooltips: {
          enabled: false
        }
    }
    const byDate = (a, b) => {
      return moment(b.date).diff(moment(a.date), 'days');
    };

return (
        <>
          <List>
          {props.data.sort(byDate).map((ex, index) =>
            <List.Item key={index} style={{marginTop:"1em", marginBottom:"1em"}}>
              <Grid doubling>
                <Grid.Column width={3} verticalAlign="middle">

                  {(ex.score === 100) ?
                    <Icon name='check' size = "big" style={{marginLeft:"8px", color:"#76a544"}}/>
                  :
                  <Doughnut
                    width={50} 
                    height={50}
                    options={options} 
                    data = {{
                      datasets:[{ 
                            data: [ex.score, 100-ex.score], 
                            backgroundColor: [((ex.score > scoreBenchmark) ? "#76a544" : "#d74e42"), '#d1e0de'] 
                      }] 
                    }}
                  />
                  }
                </Grid.Column>

                <Grid.Column width={8}>
                  
                <Header as='h5' style={{color:"#45818e", fontSize:"120%"}}>
                    {ex.name}
                    <Header.Subheader style={{color:"red", paddingTop:"0.3em"}}> 
                    <span style={{fontSize:"160%", color: (ex.score > scoreBenchmark) ? "#76a544" : "#d74e42"}}> {ex.score}%</span>
                      <span style={{color: "#838383", fontSize:"88%"}}> 
                        &nbsp;AVG Score<br/> 
                        Total Practices: {ex.tot}<br/>
                        <span style={{color:"#45818e",fontWeight:"bold", fontSize:"120%"}}>Last:&nbsp;{moment(ex.date).format('DD/MM/YYYY')} </span>
                      </span>
                    </Header.Subheader>
                  </Header>
                    <span style={{ fontSize: "80%", color: "grey" }}>
                      {ex.difficulty} &nbsp;
                      
                      {ex.difficulty.toLowerCase() == "easy" ? <span style={{color:"#f8c410"}}><Icon name = "music" size="small"/></span> : ""}
                      {ex.difficulty.toLowerCase() == "medium" ? <span style={{color:"#78909c"}}><Icon name = "music" size="small"/><Icon name = "music"size="small"/></span> : ""}
                      {ex.difficulty.toLowerCase() == "hard" ? <span style={{color:"#803843"}}><Icon name = "music"size="small"/><Icon name = "music"size="small"/><Icon name = "music"size="small"/></span> : ""}
                    </span>
                </Grid.Column>

                <Grid.Column width={5} verticalAlign="middle" textAlign="right">
                  
                  {(ex.score <= scoreBenchmark) && <>
                  <Button onClick={()=>{history.push("/exercises/" + ex.id)}}
                          size ="mini" 
                          basic color="red" 
                          style ={{fontSize:"102%", fontWeight:"bold", paddingLeft:"5px", paddingRight:"5px"}} 
                  >Improve Now</Button>
                  </> }
                </Grid.Column>
              </Grid>
            </List.Item>
          )}
          </List>
        </>
    );
}

export default StatisticsDetails;