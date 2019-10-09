import React, {Component} from 'react';
import './index.css';
import axios from 'axios';
import * as firebase from 'firebase';
import JokeCard from './components/JokeCard';
import uuid from 'uuid';
import TopJokes from './components/TopJokes';
import BottomJokes from './components/BottomJokes';

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
  }

  componentDidMount() {
    this.createJokeList()
    //load top and bottom jokes
  }

  async createJokeList() {
    const jokes = await this.loadJokes();
    var loadIndex = this.state.loadIndex;
    loadIndex++
    this.setState({jokeList: jokes, loadIndex: loadIndex});
  }

  async loadJokes() {
    // organize list of jokes from api calls
    var jokes = new Array(this.state.numberOfJokes);
    for (let i=0; i<jokes.length; i++) {
      //create list of existing joke ids
      var jokeIds = jokes.map(jokeData => {
        if (jokeData !== null) {
          return jokeData.id
        }
        return null
      });
      var newJoke = await this.loadJoke();
      //check if the new joke is in the existing joke list. If it is, load a new joke
      while(jokeIds.includes(newJoke.id)) {
        newJoke = await this.loadJoke();
      }
      jokes[i] = newJoke
    };
    return jokes
  }

  async loadJoke() {
    // load random joke from api
    const joke = await axios.get(this.state.url, { headers: { Accept: "application/json" }})
    const rootRef = firebase.database().ref().child("jokes");
    const jokeId = joke.data.id;
    const jokeText = joke.data.joke;
    // check if joke exists on db. If not, make a new entry
    rootRef.child(jokeId).once('value', snap => {
      if (!snap.exists()) {
        rootRef.update({
           [jokeId]: {id: jokeId, joke: jokeText ,upVotes: 0, downVotes: 0}
        });
      }
    });

    return joke.data
  }

  _handleReloadClick = () => {
    this.setState({jokeList: new Array(this.state.numberOfJokes)})
    this.createJokeList();
  }

  render() {
    return(
      <div>
        <div className="title-bar">
          <h1 id="title">I can haz dad jokes</h1>
          <h5>Made by Tyler McGoffin. Source: <a href="www.icanhazdadjoke.com">www.icanhazdadjoke.com</a></h5>
        </div>
        <div className="body-container">
          <div className="joke-list">
            <JokeList
              jokeList={this.state.jokeList}
              upVote={this._upVote}
              downVote={this._downVote}
              numberOfJokes={this.state.numberOfJokes}
            />
            <NewJokesButton
             onClick={this._handleReloadClick}
            />
          </div>
          <div className="top-and-bottom-jokes-container">
            <h2>Most Rated Jokes</h2>
            <TopJokes />
            <BottomJokes />
          </div>
        </div>
      </div>
    )
  }
}

function NewJokesButton(props) {
  return(
    <div className="button-container">
      <button className="button" id="new-jokes-button" onClick={props.onClick}><span>New Jokes</span></button>
    </div>
  )
}

function JokeList(props) {
  
  if (props.jokeList[props.numberOfJokes - 1] == null) {
    return (
    <div style={{textAlign: "center"}}>
      <h2>Loading New Jokes...</h2>
    </div>)

  } else {
    const jokeListCards = props.jokeList.map(jokeData => {
      return(
        <JokeCard
          jokeData={jokeData}
          key={uuid()}
        />
      )
    });

    return jokeListCards
  }
}

export default App
