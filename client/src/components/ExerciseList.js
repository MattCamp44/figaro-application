import React, { useState, useContext, useEffect } from 'react';
import pageTitleContext from "../context/pageTitleContext";
import './ExerciseList.css';
import {Container, Message, Transition} from "semantic-ui-react";
import ItemList from "./ItemList";
import * as API from "../API";

let timeout;

export default ( {exercises, setExercises} ) => {
  const { setPageTitle } = useContext(pageTitleContext);
  const [popup, setPopup] = useState({ visible: false });

  useEffect(() => {
    setPageTitle('Exercises');

    return function cleanup() {
      clearTimeout(timeout);
    }
  }, []);

  const handleFavoriteClick = async (id) => {
      const updatedExercises = [...exercises];
      for (const ex of updatedExercises) {
        if (ex.id === id) {
          ex.favorite = !ex.favorite;
          ex.visible = !ex.visible;
          await API.setFavorite({id, favorite: ex.favorite});
          setPopup({ visible: true, exercise: ex});
          clearTimeout(timeout);
          timeout = setTimeout(() => setPopup({ visible: false, exercise: ex }), 2000);
        }
      }
      setExercises(updatedExercises);
    };

  console.log('exercises', exercises);
  return (
    <Container fluid className="exercise-list">
      <ItemList
        exercises={exercises}
        handleIconClick={handleFavoriteClick}
        listType='Vocal'
      />
      <FavoritePopup {...popup} />
    </Container>
  );
}

function FavoritePopup(props) {
  const added = props.exercise?.favorite;
  return (
    <>
      <Transition.Group animation='browse' duration={400}>
        {props.visible && (
          <Message className='favorite-popup' color={added ? 'teal' : 'red'} size='tiny'>
            <p>
              Exercise <b>{props.exercise.name}</b> {added ? 'added to' : 'removed from'} Favorites
            </p>
          </Message>
        )}
      </Transition.Group>
    </>
  );
}