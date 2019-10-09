import React, {Component} from 'react';
import '../index.css';
import * as firebase from 'firebase';

export default class TopJokes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topJokeListData: [],
        }
    }

    componentDidMount() {
        this.getTopJokes();
    }

    getTopJokes = async () => {
        var topJokeListData = [];
        await firebase.database().ref('jokes').orderByChild('upVotes').limitToLast(5).once('value', snap => {
            snap.forEach(child => {
                topJokeListData.push(child.val())
            });
        });
        this.setState({
            topJokeListData: topJokeListData.reverse(),
        });
        }

    render() {
        const topJokeListText = this.state.topJokeListData.map((jokeData, idx) => <React.Fragment key={jokeData.id}><div><p id="rated-text"><b>{idx+1}.</b> {jokeData.joke} <b>{'\u2714'}'s: {jokeData.upVotes}</b></p></div></React.Fragment>)

        return(
            <div className="rated-jokes-box">
                <h3>Best Jokes {'\u2714'}</h3>
                <div className="top-jokes-list">
                    {topJokeListText}
                </div>
            </div>
        )
    }
}