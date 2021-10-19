import React, { useContext, useEffect } from 'react';
import pageTitleContext from "../context/pageTitleContext";
import {Tab} from "semantic-ui-react";
import {NoData, StatisticsDetails, StatisticsProgress} from "../components";
import * as API from "../API";

let progressData = {labels:[], datasets:[]};
let detailedData = [];
//Count Average score from a list
const average = list => list.reduce((prev, curr) => prev + curr) / list.length;



function progressTabdata (obj) {
    if (obj[0].difficulty === undefined) {return;}

    let weekOrder = [];
    const arrayOfWeekdays = ['Mon','Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const colors = {Easy: "#f8c410", Medium: "#78909c", Hard: "#803843"};

    // Weekdays order for bar chart : today to be the last in array 
    const dateObjNow = new Date()
    const weekdayNumberNow = dateObjNow.getDay()

    for (let i = 7; i>0 ; i--){
      if (i === 1) {
        weekOrder.push('TODAY');

      } else if((weekdayNumberNow - i) <  0){
        let a = (weekdayNumberNow - i) + 7;
        weekOrder.push(arrayOfWeekdays[a]);
      }else{
        weekOrder.push(arrayOfWeekdays[weekdayNumberNow-i]);
      }
    }
    
    
    
//----------- Assign labels
    progressData.labels = weekOrder;

//Create datasets
    let all = {
      "Easy": { 
        label: 'Easy', 
        data: [0,0,0,0,0,0,0], 
        backgroundColor: colors.Easy
      }, 
      "Medium":{
        label:'Medium',
        data:[0,0,0,0,0,0,0],
        backgroundColor: colors.Medium
      }, 
      "Hard":{
        label:'Hard',
        data:[0,0,0,0,0,0,0],
        backgroundColor: colors.Hard
      }
    };

    for(let o of obj) {
      let type = o.difficulty;
      for (let j of o.scores) {
        //all[type].push(s)

        let jDate = new Date(j.date)
// how many days between today and jDate
        let x = Math.round((dateObjNow - jDate)/(1000*60*60*24));
        for (let g = 0; g <= 6 ; g ++) {
          if (x === g){
// g = 0 case is today should be the last element of array, that's why (6-g)
            let z = 6-g
            all[type].data[z] = all[type].data[z] + 1;
          }
        }
      }
    } 

//------------ Assign datasets
    progressData.datasets.push(all.Easy);
    progressData.datasets.push(all.Medium);
    progressData.datasets.push(all.Hard);

}



const fetchStatDat = async () => {
try {
    const response = await API.getStatistics();
      if (response) {
        //Create data object for progress tab
        progressTabdata(response);
        
        //Create data object for detailedData tab
          for(let d of response){
            let avgList = [];
            for (let s of d.scores){avgList.push(s.percentage)}
            
            detailedData.push({ "id": d.id, 
                                "date": new Date(Math.max(...d.scores.map(e => new Date(e.date)))), 
                                "score": Math.floor(average(avgList)),
                                "tot": d.scores.length,
                                "name": d.name, 
                                "difficulty":d.difficulty})
          }
      }
  } catch (err) {}
};

fetchStatDat();

const panes = [
  {
    menuItem: {content:'Exercises', icon:"search plus"},
    render: () => <Tab.Pane attached={false}>
      {detailedData ?  
        <StatisticsDetails data={detailedData}/> :
        <NoData 
          icon="frown outline" 
          text="No data yet?" 
          subText = "Probably because you haven't completed any exercise recently. Practice more and see your result!"/>
      }
      </Tab.Pane>,
  },
  {
    menuItem: {content:'Practice Intensity', icon:'chart bar outline'},
    render: () => <Tab.Pane attached={false}>
      {progressData.datasets ?  
        <StatisticsProgress dta={progressData}/> :
        <NoData 
          icon="frown outline" 
          text="No Progress data yet?" 
          subText = "Probably because you haven't completed any exercise recently. Practice more and see your progress!"/>
      }
      </Tab.Pane>
  }
]

export default () => {
  const { setPageTitle } = useContext(pageTitleContext);
  useEffect(() => {
    setPageTitle('Statistics');
  }, []);

  return (
    <>
    <Tab menu={{ color:"teal", attached: false, tabular: true }} panes={panes} grid={{paneWidth: 6, tabWidth: 2}}/>
    </>
  );
}

