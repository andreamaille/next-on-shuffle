import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import RelatedArtists from './RelatedArtists.js'
import RelatedTracks from './RelatedTracks.js'
import headerImage from './header-dark-image.jpg';
import { Link, animateScroll as scroll } from "react-scroll";



class App extends Component {
  constructor () {
    super();
    this.state = {
      isLoading:true,
      isHidden:true,
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
      response = response.data.topalbums.album[0]

      // response = response.data.topalbums.album[0].image[3]

      const albumArray = [...this.state.artistInfo];

      albumArray.push(response);

      console.log(albumArray);
      

      // console.log(response, imageArray);

      this.setState({
        artistInfo: albumArray
      }, () => {
          // this.scroll();
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
      chosenArtist: userArtist,
      isHidden:false
    }, () => {
      this.callApiSimilarArtists();
    })
  }

  // scroll = () => {
  //   const results = document.getElementById(this.state.isHidden);

  //   results.scrollIntoView({ behavior: 'smooth' });
  // }



  handleChange = (event) => {
    this.setState({
      userInput: event.target.value
    })
  }


  render() {
    
    return (
      <div className="App">
        <header>
          <div className="header-content">
            <h1>Next on Shuffle</h1>
            <p>Discover new music with the music you already love. Enter an artist and explore new artists</p>
            <form action="">
              <label htmlFor="">Enter your artist</label>
              <input
                onChange={this.handleChange}
                type="text"
                placeholder="Search for Artist"
                value={this.state.userInput}
              />
              <Link
                activeClass="active"
                to="related-artists"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                <button onClick={this.handleClick}>Search</button>
              </Link>
            </form>
          </div>
        </header>
        <main>

          <section className="related-artists" id="related-artists">
            {this.state.isHidden ? <div></div> : 
              <div className="search-results">

                <h2>Related Artists</h2>
                {this.state.artistInfo.map((info) => {
                  let imageUrl = info.image[3]['#text'];
                  return (
                    <RelatedArtists imageUrl={imageUrl} artist={info.artist.name} albumUrl={info.artist.url} playCount={info.playcount} albumName={info.name}/>
                  )
                })}
              </div>
          }
          </section>

          <section className="related-tracks">
            {this.state.isHidden ? <div></div> : 

            <div className="top-tracks">
              <h2>Top Tracks Related to {this.state.chosenArtist}</h2>
                {this.state.artistTracks.map((track) => {
                  return (
                    track.map((index) => {
                      return (
                        <RelatedTracks albumTracks={index.name} />
                      )
                    })
                  )
                })}
            </div>
          }
          </section>
        </main>
      </div>
    );
  }

}


export default App;
