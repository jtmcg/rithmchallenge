import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as firebase from 'firebase';

export default class JokeCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.jokeData.id,
            joke: this.props.jokeData.joke,
            upVotes: 0,
            downVotes: 0,
            voted: false,
        }

        this.upVote = this.upVote.bind(this);
        this.downVote = this.downVote.bind(this);
    }

    componentDidMount() {
        const rootRef = firebase.database().ref().child('jokes');
        const jokeRef = rootRef.child(this.state.id);
        jokeRef.on('value', snap => {
            this.setState(snap.val())
        })
    }

    upVote() {
        if (!this.state.voted) {
            const rootRef = firebase.database().ref().child('jokes');
            const jokeRef = rootRef.child(this.state.id);
            jokeRef.transaction(jokeData => {
                jokeData.upVotes++
                return jokeData
            })
            this.setState({voted: true});
        } else {
            alert("You may only vote once per joke!")
        }
    }

    downVote() {
        if (!this.state.voted) { 
            const rootRef = firebase.database().ref().child('jokes');
            const jokeRef = rootRef.child(this.state.id);
            jokeRef.transaction(jokeData => {
                jokeData.downVotes++
                return jokeData
            })
            this.setState({voted: true});
        } else {
            alert("You may only vote once per joke!")
        }
    }


    render() {
        return(
            <div className="joke-card">
                <p>{this.state.joke}</p>
                <div className="vote-container">
                    <div className="up-votes-container">
                        Up Votes: {this.state.upVotes}
                        <button id="up-vote" onClick={this.upVote}><span>Like</span></button>
                    </div>
                    <div className="down-votes-container">
                        <button id="down-vote" onClick={this.downVote}>Dislike</button>
                        Down Votes: {this.state.downVotes}
                    </div>
                </div>
            </div>
        )
    }
}
