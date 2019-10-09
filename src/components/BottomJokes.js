import React, {Component} from 'react';
import '../index.css';
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
        await firebase.database().ref('jokes').orderByChild('downVotes').limitToLast(5).once('value', snap => {
            snap.forEach(child => {
                bottomJokeListData.push(child.val())
            });
        });
        this.setState({
            bottomJokeListData: bottomJokeListData.reverse(),
        });
        }

    render() {
        const bottomJokeListText = this.state.bottomJokeListData.map((jokeData, idx) => <React.Fragment key={jokeData.id}><div><p id="rated-text"><b>{idx+1}.</b> {jokeData.joke} <b>{'\u2716'}'s: {jokeData.downVotes}</b></p></div></React.Fragment>)

        return(
            <div className="rated-jokes-box">
                <h3>Worst Jokes {'\u2716'}</h3>
                <div className="bottom-jokes-list">
                    {bottomJokeListText}
                </div>
            </div>
        )
    }
}