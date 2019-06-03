import React, { Component, Fragment } from 'react';
import axios from 'axios'
import './styles/App.scss';
import RelatedArtists from './RelatedArtists.js'
import RelatedTracks from './RelatedTracks.js'
import { Link } from 'react-scroll'
import firebase from './firebase';

class App extends Component {
  constructor () {
    super();
    // Ref for accessibility of dynamic content
    this.headingElement = React.createRef();
    // stored data  
    this.state = {
      isLoading:true,
      isHidden:true,
      isReset: true,
      isArtistUnknown:true,
      noResults:true,
      userArtist:'',
      userInput:'',
      relatedArtistArray:[],
      relatedArtistInfo:[],
      relatedArtistTracks:[],
      recentlyViewedArtists: []
    }
  }
  // binds the input
  handleChange = (event) => {
    this.setState({
      userInput: event.target.value
    })
  }
  // on click of search button, the user input will be stored and then used to call the API. searchAgain function is also called to hide search bar and asks user if they would like to search for another artist.
  handleClick = (event) => {
    event.preventDefault();
    //save user input 
    const userArtist = this.state.userInput;
     // store user input in state
    this.setState({
      userArtist: userArtist,
      isHidden: false
    }, () => {
      this.callApiSimilarArtists();
      this.searchAgain();
    })
  }

  // calls Api to get similar artists based on user's chosen artist
  callApiSimilarArtists = () => {
    const apiKey = '4fb1117993625941ed0d8edc14f7ed9a';
    axios({
      method: 'GET',
      url: 'https://ws.audioscrobbler.com/2.0/',
      dataResponse: 'JSON',
      params: {
        api_key: apiKey,
        method: 'artist.getSimilar',
        artist: this.state.userArtist,
        limit: 6,
        autocorrect: 1,
        format: 'json'
      }
    }).then((response) => {
      response = response.data.similarartists.artist
      this.setState({
        similarArtists: response,
      }, () => {
          // if API has no similar artist suggestions for user's chosen artist, displays message to user to choose a different artist
          if (this.state.similarArtists.length === 0) {
            this.noResults();
          } else {
            // if API has similar artists suggestions for user's chosen artist, stores user input in firebase
            const dbRef = firebase.database().ref() 
            dbRef.push(this.state.userInput);
            // calls function to map over similarArtist array to pass to other API calls
            this.getArtistInfo();
          }
      });
    }).catch(error => {
      //if user's chosen artist can not be found in API data, call functions to reset the form and display error message
      this.resetForm();
      this.searchError();
    })
  }

  // maps over similarArtists array to get artist names to pass to other Api calls. Also calls getFirebaseArtists function to get recently searched artists stored in Firebase
  getArtistInfo = () => {
    const relatedArtists = [...this.state.similarArtists];
    const artistName = relatedArtists.map(artist => {
      return(artist.name);
    })
    this.setState({
      relatedArtistArray: artistName
    }, artistName.forEach(artist => { 
      this.callApiTopAlbums(artist);
      this.callApiTopTracks(artist);
    }));
    this.getFirebaseArtists();
  }

  // secondary API call to get album data of similar artists
  callApiTopAlbums = (artistName) => {
    const apiKey = '4fb1117993625941ed0d8edc14f7ed9a';
    axios({
      method: 'GET',
      url: 'https://ws.audioscrobbler.com/2.0/',
      dataResponse: 'JSON',
      params: {
        api_key: apiKey,
        method: 'artist.getTopAlbums',
        artist: artistName,
        limit: 6,
        autocorrect: 1,
        format: 'json'
      }
    }).then((response) => {
      response = response.data.topalbums.album[0]

      const albumArray = [...this.state.relatedArtistInfo];
      
      albumArray.push(response);

      this.setState({
        relatedArtistInfo: albumArray,
        isLoading:false
      })
    }).catch(error => {
      alert('Sorry - we failed to get data back from our API at this time. Please check back later!');
    })
  }

  // secondary API call to get top tracks of similar artists
  callApiTopTracks = (artistName) => {
    const apiKey = '4fb1117993625941ed0d8edc14f7ed9a';
    axios({
      method: 'GET',
      url: 'https://ws.audioscrobbler.com/2.0/',
      dataResponse: 'JSON',
      params: {
        api_key: apiKey,
        method: 'artist.gettoptracks',
        artist: artistName,
        limit: 6,
        autocorrect: 1,
        format: 'json'
      }
    }).then((response) => {
      response = response.data.toptracks.track

      const topTracksArray = [...this.state.relatedArtistTracks];

      topTracksArray.push(response)

      this.setState({
        relatedArtistTracks: topTracksArray
      })
      
    }).catch(error => {
      alert('Sorry - we failed to get data back from our API at this time. Please check back later!');
    })
  }

  // grabs the last 5 values in our firebase database to display on page in Recently Viewed Artists section
  getFirebaseArtists = () => {
    const dbRef = firebase.database().ref().limitToLast(5)

    dbRef.on('value', (response) => {
      const previousArtists = [];
      const data = response.val()

      for (let key in data) {
        previousArtists.push({
          id: key,
          name: data[key],
        });
      }

      this.setState({
        recentlyViewedArtists: previousArtists
      })
    })
  }

  // on click of an artist in Recently Viewed Artist Section, searches for similar artists 
  artistSearch = (event) => {
    event.preventDefault();

    const selectedArtist = event.currentTarget.dataset.id;

    // sets the userInput and userArtist values to the artist's name that was clicked on and clears the arrays to accept new data from the API calls
    this.setState({
      userInput: selectedArtist,
      userArtist: selectedArtist,
      relatedArtistArray: [],
      relatedArtistInfo: [],
      relatedArtistTracks: [],
      recentlyViewedArtists: []
    }, () => {
      this.callApiSimilarArtists();
    })
  }
  
  // Resets the form to accept the next search
  resetForm = () => {
    this.setState({
      isLoading:true,
      isReset: true,
      isHidden: true,
      isArtistUnknown: true,
      noResults:true,
      userArtist: '',
      userInput: '',
      relatedArtistArray: [],
      relatedArtistInfo: [],
      relatedArtistTracks: []
    })
  }

  // For error handling - hides search bar and asks user if they would like to search for another artist
  searchAgain = () => {
    this.setState({
      isLoading: true,
      isReset: false,
      isArtistUnknown:true,
      noResults: true
    })
  }

  // if artist does not exist in API data, displays message to user
  searchError = () => {
    this.setState({
      isArtistUnknown: false,
    })
  }

  // if artist exists in API data but API has no suggestions for similar artists, displays message to user
  noResults = () => {
    this.setState({
      isHidden:true,
      noResults: false,
      isArtistUnknown: true,
      isReset: true
    })
  }

  // For accessibility - to ensure that screen readers are taken to the beginning of the dynamic content
  scrollToMyRef = () => {
    window.scrollTo(0, this.headingElement.current.offsetTop)
  }

  render() {
    return (
      <Fragment>
        <header>
          <div className="wrapper header-content">
            <div className="header-text">
              <h1 tabIndex="1">Next on Shuffle</h1>
                <div className="app-description" tabIndex="2">
                  <p className="subtitle">New music is waiting for you.</p>
                  <p>Discover new music with the music you already love. Enter your favorite artist or band to get started</p>
              </div>
              {this.state.isReset ?

                <form action="search-artists" method="POST" name="search-artists">
                  <label htmlFor="search-button" className="visually-hidden">Enter your artist</label>
                  <input
                    onChange={this.handleChange}
                    type="text"
                    placeholder="Search for Artist"
                    value={this.state.userInput}
                    id="search-button"
                    name="search-button"
                  />

                  <Link
                    activeClass="active"
                    to="related-artists"
                    id="related-artists"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}>
                    <button onClick={this.handleClick} className="main-search-button" aria-label="After clicking on this button, you will be taken directly to the Related Artists Section">Search</button>
                  </Link>
                </form>

                : 

                <div className="header-reset">
                  {/* sound wave animation */}
                  <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                  </div>
                  <p>Want more music?</p>
                  <button onClick={this.resetForm} className="header-reset-button">Search for Another Artist</button>
                </div>
                }
                {/* error handling - if artist is not in database */}
                {this.state.isArtistUnknown ? ' ' : <p tabIndex="3" className="error-message">We couldn't find your requested artist. Please check spelling and try again!</p>}

                {/* error handling - if artist is in database but there are no suggested artists */}
                {this.state.noResults ? ' ' : <p tabIndex="3" className="error-message">There are no related artists for <span>{this.state.userArtist}</span>. Try another artist!</p>}
            </div>
          </div>
        </header>
        {/* while page loads, stays on header until API data can be loaded */}
        {this.state.isLoading ? ' ' :
          <main role="status" aria-live="polite">
            <div className="wrapper">
              <section className="related-artists" id="related-artists">
                <div className="search-results">
                  <h2 ref={this.headingElement} tabIndex="4">Related Artists</h2>
                  <ul className="related-artist-results">
                      {this.state.relatedArtistInfo.map((info, index) => {
                        let imageUrl = info.image[3]['#text'];
                        return (
                          <RelatedArtists key={index} imageUrl={imageUrl} artist={info.artist.name} albumUrl={info.artist.url} playCount={info.playcount} albumName={info.name} scrollToMyRef={this.scrollToMyRef}/>)
                      })}
                  </ul>
                </div>
              </section>
              
              <section className="related-tracks">
                <div className="related-tracks-wrapper">
                  <h2 tabIndex="5">Top Tracks for {this.state.userArtist}</h2>
                  <a href="#recently-viewed-section" className="visually-hidden skip-link"> Skip Top Tracks Section for your chosen artist and skip to Recently Searched Artists</a>
                  <ul className="related-artist-tracks">
                    {this.state.relatedArtistTracks.map((track, index) => {
                      return(
                        track.map((index, indexTrack) => {
                          return (
                            <RelatedTracks key={indexTrack} headingRef={this.headingElement} songName={index.name} songUrl={index.url}/>
                          )
                        })
                      )
                    })}
                  </ul>
                </div>
              </section>

              <section className="recently-viewed-section" id="recently-viewed-section">
                <div className="recently-viewed-wrapper">
                  <h2 tabIndex="6">Recently Viewed Artists</h2>
                  <ul className="recent-artists">
                    {this.state.recentlyViewedArtists.map((artist, index) => {
                      return(
                        <li key={index} className="recent-artists-card" onClick={this.artistSearch} data-id={artist.name}>
                            <p className="artist-name" tabIndex={index}>{artist.name}</p>
                        </li>
                      )
                    })}
                  </ul>
                  <button type="reset" onClick={this.resetForm} className="section-reset-button">Search Again</button>
                </div>
              </section>
            </div>
          </main>
        }
          <footer>
            {this.state.isHidden ? ' ' : 
              <div className="footer-text">
                <div className="spinner">
                  <div className="rect1"></div>
                  <div className="rect2"></div>
                  <div className="rect3"></div>
                  <div className="rect4"></div>
                  <div className="rect5"></div>
                  <div className="rect1"></div>
                  <div className="rect2"></div>
                  <div className="rect3"></div>
                  <div className="rect4"></div>
                  <div className="rect5"></div>
                  <div className="rect1"></div>
                  <div className="rect2"></div>
                  <div className="rect3"></div>
                  <div className="rect4"></div>
                  <div className="rect5"></div>
                </div>
                <p> &copy; 2019</p>
                <p>Designed and coded by <a href="https://twitter.com/andrea_codes">andrea_codes</a></p>
              </div>
            }
          </footer>
      </Fragment>
    );
  }
}

export default App;
