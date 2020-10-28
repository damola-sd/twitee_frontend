import React, { Component } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';



//Testing
import axios from "axios";
import AuthService from "../services/auth.service";
import TwitService from "../services/twit.service";
import { Input } from "@material-ui/core";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeTwit = this.onChangeTwit.bind(this);
    this.postnewTwit = this.postnewTwit.bind(this);



    this.state = {
      twits: [],
      message: "",
      newComment: "",
      newTwit: "",
      loggedIn: false,
    };
  }

  onChangeTwit(e) {
    this.setState({
      newTwit: e.target.value,
    });
  }

  onChangeComment(e) {
    this.setState({
      newComment: e.target.value,
    });
  }

  componentDidMount() {
    const token = AuthService.getToken();
    if (token) {
      this.setState({
        loggedIn: true,
      });
    }
    TwitService.getallTwits().then(
      (response) => {
        this.setState({
          twits: response.data.data,
        });
      },
      (error) => {
        this.setState({
          message:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  handleSubmit(twitID) {
    if (this.state.loggedIn) {
      TwitService.addComment(this.state.newComment, twitID).then(
        () => {
          window.location.reload();
        },
        (error) => {
          console.log(error);
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    } else {
      alert("You need to be logged in to comment");
    }
  }

  postnewTwit(e) {
    e.preventDefault();
    if (this.state.loggedIn) {
      TwitService.createNewTwit(this.state.newTwit).then(
        () => {
          window.location.reload();

        }, (error) => {
          console.log(error);
        }
      )
    }else {
      alert("You need to be logged in to post a twit");
    }
  }

  deleteTwit(twitId) {
    if(this.state.loggedIn) {
      TwitService.deleteTwit(twitId).then(
        () => {
          window.location.reload()
        }, (error) => {
          alert("You cannot deletea tweet that is not yours");
        }
      )
    }else {
      alert("You need to be logged in to delete a twit");

    }
  }

  render() {
    const { twits, message, newComment } = this.state;
    return (
      <div className="container">
        {twits.map((twit) => {
          return (
            <Accordion key={twit.id}>
              <AccordionSummary
                style={{ backgroundColor: "lightgrey",display: "flex", justifyContent: "space-between" }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>
                  {twit.writer.name}
                </Typography>
                <Typography style={{  marginLeft: "10px" ,fontSize: "1rem", fontWeight: "normal" }}>
                  {twit.twit}
                </Typography>
                <Typography style={{ margin: "10px" }}>
                  {twit.likes ? twit.likes + "likes" : "0 likes"}
                </Typography>
                < DeleteIcon 
                  onClick={() => { this.deleteTwit(twit.id)}}
                />
              </AccordionSummary>
              <AccordionDetails
                style={{display: "flex", flexDirection: "column"}}
              >
                {twit.comments.length > 0 ? (
                  twit.comments.map((comment) => {
                    return (
                      <div
                        style={{
                          margin: "0.2rem",
                          padding: "0.5rem",
                          width: "100%",
                          backgroundColor: "teal",
                        }}
                      >
                        <Typography>{comment.comment}</Typography>
                        <Typography>
                          Comment by {comment.writer.name}
                        </Typography>

                      </div>
                    );
                  })
                ) : <div>No comments yet, Be the first to comment</div>}
                {/* <label htmlFor="comment">Comment</label> */}
                        <Input
                          type="text"
                          name="comment"
                          placeholder="Add comment"
                          className="form-control"
                          value={this.state.newComment}
                          onChange={this.onChangeComment}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => this.handleSubmit(twit.id)}
                        >
                          Add Comment
                        </Button>
              </AccordionDetails>
            </Accordion>
          );
        })}
        <div>
        {/* <label htmlFor="twit">Comment</label> */}
                        <Input
                          placeholder="What's new?"
                          type="text"
                          name="twit"
                          className="form-control"
                          value={this.state.newTwit}
                          onChange={this.onChangeTwit}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.postnewTwit}
                        >
                          Twit
                        </Button>
        </div>
      </div>
    );
  }
}
