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
        const bottomJokeListText = this.state.bottomJokeListData.map((jokeData, idx) => <React.Fragment key={jokeData.id}><div><b>{idx+1}.</b> {jokeData.joke} Down Votes: {jokeData.downVotes}</div></React.Fragment>)

        return(
            <div className="bottom-jokes">
                <h3>Bottom Rated Jokes</h3>
                {bottomJokeListText}
            </div>
        )
    }
}