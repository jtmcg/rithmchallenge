import React, {Component} from 'react';
import './index.css';
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
        console.log(topJokeListData)
        this.setState({
            topJokeListData: topJokeListData,
        }, console.log(this.state.topJokeListData));
        }

    render() {
        const topJokeListText = this.state.topJokeListData.map((jokeData, idx) => <div>{idx+1}. {jokeData.joke} Up Votes: {jokeData.upVotes}</div>)

        return(
            <div className="top-jokes">
                <h3>Top Rated Jokes</h3>
                {topJokeListText}
            </div>
        )
    }
}