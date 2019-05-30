import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import Results from './Results.js'

class App extends Component {
  constructor () {
    super();
    this.state = {
      isLoading:true,
      chosenArtist:'',
      userInput:'',
      similarArtistName:[],
      artistInfo:[],
      artistTracks:[]
    }
  }  

  callApiSimilarArtists = () => {
    const apiKey = '4fb1117993625941ed0d8edc14f7ed9a';
    axios({
      method: 'GET',
      url: 'http://ws.audioscrobbler.com/2.0/',
      dataResponse: 'JSON',
      params: {
        api_key: apiKey,
        method: 'artist.getSimilar',
        artist: this.state.chosenArtist,
        limit: 5,
        autocorrect: 1,
        format: 'json'
      }
    }).then((response) => {
      response = response.data.similarartists.artist
      
      this.setState({
        similarArtists: response
      }, () => {
        // console.log(this.state.similarArtists);
        this.getArtistInfo();
      });

    }).catch(error => {
      console.log('failed')
    })
  }
  // to send similar artist to API calls
  getArtistInfo = () => {
    const relatedArtists = this.state.similarArtists;

    const artistName = relatedArtists.map(artist => {
      return(artist.name);
    })
    
    this.setState({
      similarArtistName: artistName
    }, artistName.forEach(artist => { 
      this.callApiTopAlbums(artist);
      this.callApiTopTracks(artist);
    }));
  }

  // used to get an image related to artist
  callApiTopAlbums = (artistName) => {
    const apiKey = '4fb1117993625941ed0d8edc14f7ed9a';
    axios({
      method: 'GET',
      url: 'http://ws.audioscrobbler.com/2.0/',
      dataResponse: 'JSON',
      params: {
        api_key: apiKey,
        method: 'artist.getTopAlbums',
        artist: artistName,
        limit: 5,
        autocorrect: 1,
        format: 'json'
      }
    }).then((response) => {
      response = response.data.topalbums.album[0].image[3]

      
      // response = response.data.topalbums.album[0].image[3]

      const imageArray = [...this.state.artistInfo];

      imageArray.push(response);

      console.log(imageArray);
      

      // console.log(response, imageArray);

      this.setState({
        artistInfo: imageArray
      }, () => {
        
      });
    
    }).catch(error => {
      console.log('failed')
    })
  }

  callApiTopTracks = (artistName) => {
    const apiKey = '4fb1117993625941ed0d8edc14f7ed9a';
    axios({
      method: 'GET',
      url: 'http://ws.audioscrobbler.com/2.0/',
      dataResponse: 'JSON',
      params: {
        api_key: apiKey,
        method: 'artist.gettoptracks',
        artist: artistName,
        limit: 5,
        autocorrect: 1,
        format: 'json'
      }
    }).then((response) => {
      response = response.data.toptracks.track

      const topTracksArray = [...this.state.artistTracks];

      topTracksArray.push(response)

      

      this.setState({
        artistTracks: topTracksArray
      })
      

    }).catch(error => {
      console.log('failed')
    })
  }



  handleClick = (event) => {
    event.preventDefault();

    // Getting a list of similar Artists 
    const userArtist = this.state.userInput;

    this.setState({
      userInput: '',
      chosenArtist: userArtist
    }, () => {
      this.callApiSimilarArtists();
    })

  }

  handleChange = (event) => {
    this.setState({
      userInput: event.target.value
    })
  }

 

  render() {
    
    return (
      <div className="App">
      
        <header>

          <h1>App Title</h1>
          <p>Discover new music with the music you already love. Enter an artist and explore new artists</p>
          <form action="">
            <label htmlFor="">Enter your artist</label>
            <input
              onChange={this.handleChange}
              type="text"
              placeholder="Search for Artist"
              value={this.state.userInput}
            />
            <button onClick={this.handleClick}>Search</button>
          </form>
          </header>

          <main>

            <ul>


          



              {this.state.similarArtistName.map((artist) => {
                return (
                    <Results artistName={artist} />
                )
              })}

              {this.state.artistInfo.map((image) => {
                let imageUrl = image['#text'];
                return (
                  <Results imageUrl={imageUrl} />
                  )
              })}


              {this.state.artistTracks.map((track) => {
                return (
                  track.map((index)=>{
                    return(
                      <Results albumTracks={index.name} />

                    )
                  })
                )
              })}



            </ul>
            


          </main>

      </div>
    );
  }

}


export default App;
