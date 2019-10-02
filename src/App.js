import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import * as firebase from 'firebase';
import JokeCard from './JokeCard';
//import TopJokes from './TopJokes';

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
      loadIndex: 0,
    }

    this._handleReloadClick = this._handleReloadClick.bind(this);
  }

  componentDidMount() {
    this.createJokeList()
    console.log(this.state.jokeList)
    //load top and bottom jokes
  }

  async createJokeList() {
    const jokes = await this.loadJokes();
    var loadIndex = this.state.loadIndex;
    loadIndex++
    this.setState({jokeList: jokes, loadIndex: loadIndex})
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
    const rootRef = firebase.database().ref().child("jokes");
    const jokeId = joke.data.id;

    rootRef.child(jokeId).once('value', snap => {
      if (!snap.exists()) {
        rootRef.update({
           [jokeId]: {upVotes: 0, downVotes: 0}
        });
      }
    });

    return joke.data
  }

  async _handleReloadClick() {
    //load a new set of jokeID
    this.setState({jokeList: new Array(this.state.numberOfJokes)})
    this.createJokeList();
    console.log('load new jokes click handled')
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
              loadIndex={loadIndex}
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
    const loadKey = jokeData.id; //The page isn't reloading data if there are jokes that stay the same because their keys aren't changing. Need to assign keys with loadIndex from state.
    return(
      <JokeCard
        jokeData={jokeData}
        key={loadKey}
      />
    )
  });

  return jokeListCards
}

//These two will be removed later
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
