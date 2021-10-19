import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from "semantic-ui-react";
import {  Favorites, Homepage, Profile, Statistics, ExerciseList, HeaderMenu, FooterMenu, Error } from './components';
import pageTitleContext from "./context/pageTitleContext";
import NewExercise from './components/NewExercise'
import * as API from "./API";

function App() {
	const [pageTitle, setPageTitle] = useState("Homepage");
	const value = { pageTitle, setPageTitle };
	const [exercises, setExercises] = useState([]);
	const [doneFetching, setDoneFetching] = useState(false);

useEffect(  () => {
	console.log("App")
	const fetchExercises = async () => {
		try {
			const exercises = (await API.getExercises()).sort((a, b) => {
				return (+b["suggested"] || 0) - (+a["suggested"] || 0) || a.name.localeCompare(b.name);
			});
			console.log('exercises', exercises);
		  setExercises(exercises);
		} catch (err) {}
	  };
  
		fetchExercises().then(() => {console.log("Done fetching"); setDoneFetching(true);}).catch(() => { console.log("error fetching") });
	  
}, [])

	const removeFavorite = (id) => {
		const updatedExercises = [...exercises];
		for (const ex of updatedExercises) {
			if (ex.id === id)	ex.favorite = false;
		}
		setExercises(updatedExercises);
	};

  return (
    <div className="App">
      <pageTitleContext.Provider value={value}>
        <Router>
          <div>
            <HeaderMenu/>
            <Container text style={{ paddingTop: '5em'}}>
	            <Switch>
	              <Route path="/profile">
	                <Profile />
	              </Route>
	              <Route path="/statistics">
	                <Statistics />
	              </Route>
	              <Route path="/favorites">
	                <Favorites removeFavorite={removeFavorite} />
	              </Route>
	              <Route path="/exercises/:id">
									<NewExercise doneFetching={doneFetching} exercises={exercises} />
								</Route>
	              <Route path="/exercises">
	                <ExerciseList exercises={exercises} setExercises={setExercises} />
	              </Route>
	              <Route exact path="/">
	                <Homepage />
	              </Route>
	              <Route>
	                <Error />
	              </Route>
	            </Switch>
	         </Container>

			{
			pageTitle === "Homepage" &&
				<>
					<div className="MainBackground" />
					<FooterMenu />
				</>
			}
		  </div>
        </Router>
      </pageTitleContext.Provider>
    </div>
  );
}

export default App;
