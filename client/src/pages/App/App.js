import React, { Component } from 'react';
import { Route } from 'react-router-dom'

// import logo from './logo.svg';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js'
import NavBar from '../../components/NavBar/NavBar'
import Signup from "../Signup/Signup";
import Login from "../Login/Login";
import authService from "../../services/authService";
import Users from '../Users/Users'
import * as spotifyService from '../../services/spotifyService'
import LandingPage from '../LandingPage/LandingPage'
import MessageBoard from '../MessageBoard/MessageBoard'

const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    console.log(params);
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token? true : false,
      nowPlaying: {name: 'Not Checked', albumArt: ''},
      user: authService.getUser()
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  handleLogout = () => {
    authService.logout();
    this.setState({ user: null });
  };

  handleSignupOrLogin = () => {
    this.setState({ user: authService.getUser() });
  };

  handleGetNowPlaying = async newPlayData => {
    const response = await spotifyService.getNowPlaying(newPlayData);
    console.log(response)
    this.setState({nowPlaying: { 
      name: response.item.external_urls.name, 
      albumArt: response.item.album.images[0].url
    }})

    // this.setState(state => ({
          // nowPlaying: { 
          //     name: response.item.name, 
          //     albumArt: response.item.album.images[0].url
          //   }
        // })), () => this.props.history.push('/');
  
}
  render() {
    return (
      <>
      <div className="App">
        <NavBar
            user={this.state.user}
            handleLogout={this.handleLogout}
        />
        <Route exact path='/' render={() =>
          <LandingPage />
        } />
        <Route exact path='/messages' render={() =>
          <MessageBoard />
        } />
        
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img alt='album art' src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        <button onClick={()=> this.handleGetNowPlaying()}>
          Check Now Playing
        </button>
      </div>
      </>
    );
  }
}

export default App