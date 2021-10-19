import { Grid, Icon, Header, Container } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';


export default function FooterMenu() {
  const history = useHistory();
  return (
    <div className="footer">
      <Container text textAlign="center">
        <Grid columns={3} textAlign="center" verticalAlign="middle" style={{ color: '#45818e' }}>
          <Grid.Row>
            <Grid.Column width={3} className="footerMenuItem" floated="right" onClick={() => {
              history.push("/profile")
            }}>
              <Icon name='user'/>
              <Header.Subheader>Profile</Header.Subheader>
            </Grid.Column>
            <Grid.Column width={10} className="footerMenuItem" textAlign="center" onClick={() => {
              history.push("/statistics")
            }}>

              <Icon name="chart line"/>
              <Header.Subheader>My Statistics</Header.Subheader>

            </Grid.Column>
            <Grid.Column width={3} className="footerMenuItem" floated="left" onClick={() => {
              history.push("/favorites")
            }}>
              <Icon name="heart"/>
              <Header.Subheader>Favorites</Header.Subheader>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}
