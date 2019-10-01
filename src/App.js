import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      numberOfJokes: 20,
      jokeList: new Array(20),
      topJokes: new Array(5),
      bottomJokes: new Array(5),
      url: "https://icanhazdadjoke.com/",
    }

    this._handleReloadClick = this._handleReloadClick.bind(this);
  }

  componentDidMount() {
    this.createJokeList()
    console.log(this.state.jokeList)
    console.log(this.state.jokeListData)
    //load top and bottom jokes
  }

  async createJokeList() {
    const jokes = await this.loadJokes();
    this.setState({jokeList: jokes})
    console.log("jokes list state updated")
  }

  async loadJokes() {
    //handle API call for jokeID
    var jokes = new Array(this.state.numberOfJokes);
    for (let i=0; i<jokes.length; i++) {
      var newJoke = await this.loadJoke();
      while(jokes.includes(newJoke)) {
        console.log("duplicate joke found. Loading new joke.")
        newJoke = await this.loadJoke();
      }
      jokes[i] = newJoke
    };
    return jokes
  }

  async loadJoke() {
    const joke = await axios.get(this.state.url, { headers: { Accept: "application/json" }})
    // var jokeMap = new Map();
    // jokeMap.set(jokeListData.jokeList);
    // Need some way to add new jokes to the db here, containing id, upVotes, and downVotes.
    // if (!jokeMap.has(joke.id)) {
    //   jokeListData.numberOfKnownJokes ++;
    //   jokeListData.jokeList.push({
    //     "id": joke.id,
    //     "upVotes": 0,
    //     "downVotes": 0,
    //   })
    // }
    return joke.data
  }

  async _handleReloadClick() {
    //load a new set of jokeID
    const jokeListPromise = this.createJokeList();
    console.log('load new jokes click handled')
  }

  _upVote() {
    console.log("Liked")
  }

  _downVote() {
    console.log("Disliked")
  }

  render() {
    return(
      <div>
        <div>
          <h1>I can haz dad jokes</h1>
          <NewJokesButton
            onClick={this._handleReloadClick}
          />
        </div>
        <div>
          <div className="main-joke-container">
            <JokeList
              jokeList={this.state.jokeList}
              upVote={this._upVote}
              downVote={this._downVote}
            />
          </div>
          <div className="top-and-bottom-jokes-container">
            <TopJokes
              topJokes={this.state.topJokes}
            />
            <BottomJokes
              bottomJokes={this.state.bottomJokes}
            />
          </div>
        </div>
      </div>
    )
  }
}

function NewJokesButton(props) {
  return(
    <button id="new-jokes-button" onClick={props.onClick}>Load new joke list</button>
  )
}

function JokeList(props) {
  const jokeListCards = props.jokeList.map(jokeData => {
    return(
      <div className="joke-card">
        <p>{jokeData.joke}</p>
        <button id="up-vote" onClick={props.upVote}>Like</button>
        <button id="down-vote" onClick={props.downVote}>Dislike</button>
      </div>
    )
  });

  return jokeListCards
}

function TopJokes(props) {
  return(
    null
  )
}

function BottomJokes(props) {
  return(
    null
  )
}

export default App
