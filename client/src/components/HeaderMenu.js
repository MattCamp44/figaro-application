import React, { useContext } from 'react';
import { Container, Grid, Icon, Menu } from 'semantic-ui-react';
import { useHistory, useLocation } from 'react-router-dom';
import pageTitleContext from '../context/pageTitleContext';

function HeaderMenu() {
  const { pageTitle } = useContext(pageTitleContext);

  return pageTitle !== 'Homepage' && <NavigationHeader title={pageTitle}/>;
}

function NavigationHeader(props) {
  const history = useHistory();
  const { title } = props;
  const { pathname } = useLocation();
  const backPage = /\/exercises\/[0-9]+/g.test(pathname) ? '/exercises' : '/';

  return (
    <Menu
      style={{ backgroundColor: "#76a5af", marginBottom: '2ex' }}
      inverted
      borderless
      size='huge'
      fixed="top">
      <Container text>
        <Grid container style={{ marginLeft: '-2em' }}>
          <Grid.Column>
            <Menu.Item width={1} style={{ marginLeft: '-2em' }} onClick={() => {
              history.push(backPage);
              if (history.location.pathname === "/exercises")
                window.location.reload();
            }}>
              <Icon size='large' name='chevron left'/>
            </Menu.Item>
          </Grid.Column>
          <Grid.Column style={{
            display: 'flex',
            position: 'absolute',
            left: '0',
            width: '100%',
            zIndex: '-1'
          }}>
            <Menu.Item style={{
              fontSize: '120%',
              fontWeight: 'bold',
              textAlign: "middle",
              marginLeft: "auto",
              marginRight: "auto"
            }}>
              {title}
            </Menu.Item>
          </Grid.Column>
          <Grid.Column>
          </Grid.Column>
        </Grid>
      </Container>
    </Menu>
  );
}

export default HeaderMenu;