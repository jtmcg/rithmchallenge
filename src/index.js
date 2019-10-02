import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAzKBcDpfZvRI18vreJSpVPv5dzjPtbGaM",
    authDomain: "rithm-50db3.firebaseapp.com",
    databaseURL: "https://rithm-50db3.firebaseio.com",
    projectId: "rithm-50db3",
    storageBucket: "",
    messagingSenderId: "655798475997",
    appId: "1:655798475997:web:c0013489cfd22dd50a0f34"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
