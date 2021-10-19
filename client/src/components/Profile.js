import React, { useContext, useEffect, useState } from 'react';
import pageTitleContext from "../context/pageTitleContext";
import {Dropdown, Grid, Header, Image, Message, Transition} from "semantic-ui-react";
import * as API from "../API";

export default () => {
  const { setPageTitle } = useContext(pageTitleContext);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState({});
  const [voices, setVoices] = useState([]);
  const [avatarKey, setAvatarKey] = useState(1);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    setPageTitle('My Profile');
    setLoaded(true);

    const fetchUserInfo = async () => {
      try {
        setUser(await API.getUser());
      } catch (err) {}
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchUserPossibleVoices = async () => {
      try {
        setVoices(await API.getVoiceTypes(user["gender"]));
      } catch (err) {}
    };

    fetchUserPossibleVoices();
  }, [user]);

  const uploadAvatar = async (event) => {
    const file = event.target.files[0];
    await API.uploadAvatar({ file });
    /* force update of user image */
    setAvatarKey(avatarKey + 1);
  }

  const uploadVoice = async (e, { value }) => {
    if (await API.setVoiceType(value)) {
      setPopup(true);
      setTimeout(() => setPopup(false), 1000);
      setUser({...user, voice: value});
    }
  };

  const { firstName, lastName, ...others } = user;

  return (
    <>
      <AvatarBox loaded={loaded} name={`${firstName} ${lastName}`} avatarKey={avatarKey}/>
      <UserInfo {...others} voices={voices} handleUpload={uploadVoice}/>
      <FileUploader handleUpload={uploadAvatar}/>
      <VoiceTypePopup visible={popup}/>
    </>
  );
}

const AvatarBox = (props) => (
  <Grid centered style={{ marginTop: '-3.3ex', marginBottom: '2ex', backgroundColor: 'rgba(118, 165, 175, 0.2)'}} >
    <Grid.Row>
      <Grid.Column width={8}>
        <Transition
          animation='browse'
          duration={1000}
          visible={props.loaded}
        >
          <label htmlFor="avatar">
            <Image
              key={props.avatarKey}
              src='/api/avatar'
              bordered
              circular
              style={{cursor: 'pointer', margin: '0 auto'}}
              htmlFor="file"
            />
          </label>
        </Transition>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={10} textAlign='center'>
        <Header as='h1' style={{color: 'rgb(118, 165, 175)', fontSize: '160%', marginBottom: '0'}}>
          {props.name}
        </Header>
        <Header as='h6' style={{color: 'rgb(118, 165, 175)', fontSize: '50%', marginTop: '0'}}>
          Tap on the image to upload a new avatar
        </Header>
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

const UserInfo = (props) => {
  const { handleUpload, voice, voices, ...others } = props;
  return (
    <Grid centered divided='vertically' style={{padding: '0 2%'}}>
      {
        Object.entries(others).map(([key, value]) => {
          return key && <UserInfoRow key={key} field={key} value={(value)}/>;
        })
      }
      <UserInfoRow field={'Voice'} value={voice} list items={voices} handleChange={handleUpload}/>
    </Grid>
  );
}

const toDropdownItem = (item) => (
  {
    key: item,
    text: item,
    value: item
  }
);

const UserInfoRow = (props) => {
  return (
    <Grid.Row columns={2}>
      <Grid.Column>
        <h4 style={{textTransform: 'capitalize'}}>
          {props.field}
        </h4>
      </Grid.Column>
      <Grid.Column textAlign='right'>
        {
          props.list
            ? <Dropdown
                  style={{color: '#76a5af', fontWeight: 'bold'}}
                  text={props.value}
                  compact
                  scrolling
                  direction='left'
                  options={props.items.map(toDropdownItem)}
                  onChange={props.handleChange}
              />
            : <h4 style={{color: '#76a5af'}}>
                {props.value}
              </h4>
        }
      </Grid.Column>
    </Grid.Row>
  );
};

const FileUploader = (props) => (
  <input
    onChange={props.handleUpload}
    onClick={(event) => event.target.value = ''}
    type="file"
    id="avatar" name="avatar"
    accept="image/png"
    hidden
    style={{ visibility: "hidden" }}
  />
)

function VoiceTypePopup(props) {
  return (
      <>
        <Transition.Group animation='browse' duration={400}>
          {props.visible && (
              <Message className='favorite-popup' color={'teal'} size='tiny'>
                <p>Voice type correctly uploaded</p>
              </Message>
          )}
        </Transition.Group>
      </>
  );
}
