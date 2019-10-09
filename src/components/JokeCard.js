import React, { Component } from 'react';
import '../index.css';
import * as firebase from 'firebase';

export default class JokeCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.jokeData.id,
            joke: this.props.jokeData.joke,
            jokeLine: null,
            punchline: null,
            showPunchline: false,
            upVotes: 0,
            downVotes: 0,
            voted: false,
            upVoteId: "up-vote",
            downVoteId: "down-vote",
            upVoteClass: "vote-button",
            downVoteClass: "vote-button",
        }
    }

    componentDidMount() {
        const rootRef = firebase.database().ref().child('jokes');
        const jokeRef = rootRef.child(this.state.id);
        jokeRef.on('value', snap => {
            this.setState(snap.val())
        });

        this.stripPunchline();
    }

    stripPunchline = () => {
        const joke = this.state.joke;
        const indexOfQuestion = joke.indexOf("?");
        if (indexOfQuestion !== -1) {
            const jokeLine = joke.substring(0, indexOfQuestion+1);
            const punchline = joke.substring(indexOfQuestion+2);
            this.setState({
                jokeLine: jokeLine,
                punchline: punchline,
            });
        } else {
            this.setState({
                jokeLine: joke,
            });
        }
    }

    togglePunchline = () => {
        const showPunchline = !this.state.showPunchline;
        this.setState({
            showPunchline: showPunchline,
        });
    }

    upVote = () => {
        if (!this.state.voted) {
            const rootRef = firebase.database().ref().child('jokes');
            const jokeRef = rootRef.child(this.state.id);
            jokeRef.transaction(jokeData => {
                jokeData.upVotes++
                return jokeData
            })
            this.setState({ 
                voted: true,
                upVoteId: "up-vote-clicked",
                upVoteClass: "",
            });
        } else {
            alert("You may only vote once per joke!")
        }


    }

    downVote = () => {
        if (!this.state.voted) { 
            const rootRef = firebase.database().ref().child('jokes');
            const jokeRef = rootRef.child(this.state.id);
            jokeRef.transaction(jokeData => {
                jokeData.downVotes++
                return jokeData
            });
            this.setState({
                voted: true,
                downVoteId: "down-vote-clicked",
                downVoteClass: "",
            });

        } else {
            alert("You may only vote once per joke!")
        }
    }


    render() {

        var { jokeLine, punchline, showPunchline, upVoteId, downVoteId, upVoteClass, downVoteClass} = this.state;
        var displayJoke = <p>{jokeLine}</p>;
        if (punchline !== null && showPunchline) {
            displayJoke = <div><p>{jokeLine}</p><p>{punchline}</p></div>;
        }

        return(
            <div className="joke-card">
                <div className="joke-text" onClick={this.togglePunchline}>
                    {displayJoke}
                    <div>
                        <span style={{color: "limegreen"}}>{'\u2714'}'s: {this.state.upVotes}</span>, <span style={{color: "crimson"}}>{'\u2716'}'s: {this.state.downVotes}</span>
                    </div>
                </div>
                <div className="vote-container">
                    <div className="up-votes-container">
                        <button className={upVoteClass} id={upVoteId} onClick={this.upVote}><span>Like </span></button>
                    </div>
                    <div className="down-votes-container">
                        <button className={downVoteClass} id={downVoteId} onClick={this.downVote}><span>Dislike </span></button>
                    </div>
                </div>
            </div>
        )
    }
}
