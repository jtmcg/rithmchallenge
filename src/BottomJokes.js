import React, {Component} from 'react';
import './index.css';
import * as firebase from 'firebase';

export default class BottomJokes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bottomJokeListData: [],
        }
    }

    componentDidMount() {
        this.getBottomJokes();
    }

    getBottomJokes = async () => {
        var bottomJokeListData = [];
        await firebase.database().ref('jokes').orderByChild('upVotes').limitToFirst(5).once('value', snap => {
            snap.forEach(child => {
                bottomJokeListData.push(child.val())
            });
        });
        console.log(bottomJokeListData)
        this.setState({
            bottomJokeListData: bottomJokeListData,
        }, console.log(this.state.bottomJokeListData));
        }

    render() {
        const bottomJokeListText = this.state.bottomJokeListData.map((jokeData, idx) => <div>{idx+1}. {jokeData.joke} Down Votes: {jokeData.upVotes}</div>)

        return(
            <div className="bottom-jokes">
                <h3>Bottom Rated Jokes</h3>
                {bottomJokeListText}
            </div>
        )
    }
}