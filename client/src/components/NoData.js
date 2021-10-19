import React, {useEffect, useState} from 'react';
import {Header, Transition, Icon} from "semantic-ui-react";

function NoData (props){
    
  const [animation, setAnimation] = useState(true);
  const timer = setTimeout(() => setAnimation(!animation), 3000);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
      clearTimeout(timer)
      setLoaded(true);
  }, []);

return (
        <Transition duration={1000} visible={loaded}>
            <Header as='h1' icon style={{color:"#45818e"}}>
                <Transition animation='pulse' duration={1000} visible={animation}>
                    <Icon name={props.icon}/>
                </Transition>
                {props.text}
                <Header.Subheader style={{color:"#9999a5"}}>
                    {props.subText}
                </Header.Subheader>
            </Header>
        </Transition>
    );
}

export default NoData;