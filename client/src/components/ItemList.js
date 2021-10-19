import React from 'react';
import { Confirm, Grid, Icon, TransitionablePortal } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default class ItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  handleConfirm = () => {
    this.setState(state => {
      this.props.handleIconClick(state.id);
      return { modalOpen: false, id: null };
    });
  }

  handleCancel = () => {
    this.setState({ modalOpen: false, id: null });
  }

  handleClick = (id) => {
    if (!this.props.askConfirm) return this.props.handleIconClick(id);
    this.setState({ modalOpen: true, id: id });
  };

  render() {
    const { modalOpen } = this.state;
    const { exercises, listType, askConfirm } = this.props;
    return (
      <Grid divided='vertically'>
        {exercises.map((ex, idx) => (
          <Grid.Row columns={3} key={idx} className='list-row'>
            <Grid.Column
              verticalAlign='middle'
              width={14}
              as={Link} to={`/exercises/${ex.id}`}
              className={`list-entry ${ex["suggested"] && "list-suggested"}`}
            >
              {ex.name}
              <br/>
              <span style={{ fontSize: "70%", color: "grey" }}>
                {ex.difficulty} &nbsp;
                {ex.difficulty.toLowerCase() == "easy" ? <span style={{color:"#f8c410"}}><Icon name = "music" size="small"/></span> : ""}
                {ex.difficulty.toLowerCase() == "medium" ? <span style={{color:"#78909c"}}><Icon name = "music" size="small"/><Icon name = "music"size="small"/></span> : ""}
                {ex.difficulty.toLowerCase() == "hard" ? <span style={{color:"#803843"}}><Icon name = "music"size="small"/><Icon name = "music"size="small"/><Icon name = "music"size="small"/></span> : ""}
              </span>
              <br/>
              {ex["suggested"] &&
              <span style={{ fontSize: "70%", color: "grey" }}>
                    Suggested exercise
                  </span>
              }
            </Grid.Column>
            <Grid.Column
              width={2}
              className='list-entry'
              onClick={() => this.handleClick(ex.id)}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Icon
                size='large'
                name={
                  listType === 'Favorite'
                    ? ('trash alternate outline')
                    : (ex.favorite ? 'heart' : 'heart outline')
                }
                color={listType === 'Favorite' ? 'red' : 'grey'}
              />
            </Grid.Column>
          </Grid.Row>
        ))}
        <TransitionablePortal
          open={askConfirm && modalOpen}
          transition={{ animation: 'scale', duration: 300 }}

        >
          <Confirm
            className="resize-modal"
            open={askConfirm && modalOpen}
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirm}
            header='Favorites'
            content='Are you sure you want to remove the exercise from favorites?'
            cancelButton='No'
            confirmButton='Remove'
            size='tiny'
          />
        </TransitionablePortal>
      </Grid>
    );
  }
}
