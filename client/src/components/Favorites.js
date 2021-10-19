import React, {useContext, useEffect, useState} from 'react';
import pageTitleContext from "../context/pageTitleContext";
import ItemList from "./ItemList";
import {Container, Header, Icon, Transition} from "semantic-ui-react";
import * as API from "../API";

export default ({removeFavorite}) => {
  const [exercises, setExercises] = useState([]);
  const { setPageTitle } = useContext(pageTitleContext);

  useEffect(() => {
    setPageTitle('Favorites');

    const fetchFavorites = async () => {
      try {
        setExercises(await API.getFavorites());
      } catch (err) {}
    };

    fetchFavorites();
  }, []);

  const handleRemoveClick = async (id) => {
    setExercises([...exercises.filter(ex => ex.id !== id)]);
    removeFavorite(id);
    await API.setFavorite({id, favorite: false});
  }

  return (
    <>
      {
        (exercises && exercises.length)
        ? <ItemList
            exercises={exercises}
            handleIconClick={handleRemoveClick}
            askConfirm
            listType='Favorite'
          />
        : <NoFavorites/>
      }
    </>
  );
}

function NoFavorites() {
  const [animation, setAnimation] = useState(true);

  const timer = setTimeout(() => setAnimation(!animation), 3000);
  useEffect(() => clearTimeout(timer));

  return (
    <Container textAlign='center' style={{'marginTop': '50%'}}>
      <Header as='h1' icon style={{'color':'#76a5af'}}>
        <Transition
          animation='pulse'
          duration={1000}
          visible={animation}
        >
          <Icon name='heart'/>
        </Transition>
        No favorite exercises
      </Header>
    </Container>
  );
}