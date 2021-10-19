import React, { useContext, useEffect } from 'react';
import pageTitleContext from "../context/pageTitleContext";
import { useHistory } from "react-router-dom";
import '../index.css';
import { Container, Header, Image, Segment, Icon } from 'semantic-ui-react';

import logo from '../assets/images/logo.png';


export default () => {
  const history = useHistory();

  const { setPageTitle } = useContext(pageTitleContext);
  useEffect(() => {
    setPageTitle('Homepage');
  }, []);

  return (
    <>
      <Container text style={{ paddingBottom: "5em" }}>
        <Header as='h1' textAlign='center' style={{ zIndex: "100" }}>
          <Header.Content className="LogoTitle">
            FIGARO
            <Header.Subheader>Be ready to act</Header.Subheader>
          </Header.Content>
          <Image src={logo} size='huge' verticalAlign='middle'/>
        </Header>

        <Segment textAlign='center' className="MainButtons" onClick={() => {
          history.push("/exercises")
        }}>
          <Icon name='microphone'/> Exercises
        </Segment>
      </Container>
    </>
  );
}