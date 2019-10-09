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
        const topJokeListText = this.state.topJokeListData.map((jokeData, idx) => <React.Fragment key={jokeData.id}><div><b>{idx+1}.</b> {jokeData.joke} Up Votes: {jokeData.upVotes}</div></React.Fragment>)

        return(
            <div className="top-jokes">
                <h3>Top Rated Jokes</h3>
                {topJokeListText}
            </div>
        )
    }
}