import React from 'react';
import './App.css';
import Player from './components/player';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {

    return (
      <Router>
        <div className="App">
          <a href='/login'> Login to Spotify </a>
          <Route path="/player" component={Player}/>
        </div>
        <script src="https://sdk.scdn.co/spotify-player.js"></script>
      </Router>
    );
}

export default App;
