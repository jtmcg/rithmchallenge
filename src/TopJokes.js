import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import * as firebase from 'firebase';

export default class TopJokes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jokeList: new Array(5),
            url: "https://icanhazdadjoke.com/j/",
        }
    }

    componentDidMount() {
        const rootRef = firebase.database().ref('jokes');
        rootRef.orderByChild('upVotes');
        //This ^^ is sorting the data and nothing more. Need to extract the sorted data for the highest and lowest rated jokes
        console.log(highestRated)
        this.createJokeList(highestRated);
    }

    async createJokeList(highestRated) {
        var jokes = this.state.jokeList;
        for (let i=0; i<jokes.length; i++) {
            var loadedJokeData = await this.loadJoke(highestRated[i])
            jokes[i] = loadedJokeData.joke
        };
        jokes = Promise.all(jokes);
        console.log(jokes)
        // this.setState({
        //     jokeList: jokes,
        // });
    }

    async loadJoke(id) {
        const jokeIdURL = this.state.url+id;
        const loadedJoke = await axios.get(jokeIdURL, { headers: { Accept: "application/json"}});
        return loadedJoke.data
    }

    render() {
        return(
            <div className="top-jokes">
                {this.state.jokeList}
            </div>
        )
    }
}