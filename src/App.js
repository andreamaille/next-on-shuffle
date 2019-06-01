import React, { Component, Fragment } from 'react';
import axios from 'axios'
import './styles/App.scss';
import RelatedArtists from './RelatedArtists.js'
import RelatedTracks from './RelatedTracks.js'
import { Link } from "react-scroll";

class App extends Component {
  constructor () {
    super();
    // Ref for accessibility of dynamic con
    this.headingElement = React.createRef();
    // stored data  
    this.state = {
      isLoading:true,
      isHidden:true,
      isReset: true,
      isArtistUnknown:true,
      userArtist:'',
      userInput:'',
      relatedArtistArray:[],
      relatedArtistInfo:[],
      relatedArtistTracks:[]
    }
  }

  // binds the input
  handleChange = (event) => {
    this.setState({
      userInput: event.target.value
    })
  }

  // on click of button, the user input will be stored and then used to call the APIs 
  handleClick = (event) => {
    event.preventDefault();
    //save user input 
    const userArtist = this.state.userInput;
    // store user input in state
    this.setState({
      userArtist: userArtist,
      isHidden: false,
    }, () => {
      this.callApiSimilarArtists();
      this.resetButton();
    })
  }

  // call Api to get similar artists to user's chosen artist
  callApiSimilarArtists = () => {
    const apiKey = '4fb1117993625941ed0d8edc14f7ed9a';
    axios({
      method: 'GET',
      url: 'http://ws.audioscrobbler.com/2.0/',
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
        // call function to map over array to pass to other API calls
        this.getArtistInfo();
      });
    }).catch(error => {
      //if user input does not return any similar artists, reset the form and display error message
      this.resetForm();
      this.searchError();
    })
  }

  // mapping over array to get similar artist names to pass to Api call functions
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
  }

  // secondary Api call to get album data of similar artist
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
        limit: 6,
        autocorrect: 1,
        format: 'json'
      }
    }).then((response) => {
      response = response.data.topalbums.album[0]

      const albumArray = [...this.state.relatedArtistInfo];
      
      albumArray.push(response);

      this.setState({
        relatedArtistInfo: albumArray
      })

    }).catch(error => {
      console.log('failed')
    })
  }

  // secondary Api call to get top tracks of similar artist
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
      console.log('failed')
    })
  }

  // For error-handling and resetting the form
  resetForm = () => {
    this.setState({
      isReset: true,
      isHidden: true,
      isArtistUnknown: true,
      userArtist: '',
      userInput: '',
      relatedArtistArray: [],
      relatedArtistInfo: [],
      relatedArtistTracks: []
    })
  }

  resetButton = () => {
    this.setState({
      isReset: false,
      isArtistUnknown:true,
    })
  }

  searchError = () => {
    this.setState({
      isArtistUnknown: false,
    })
  }

  // For accessibility - to ensure that screen readers are taken to the beginning of the dynamic content
  scrollToMyRef = () => {
    window.scrollTo(0, this.headingElement.current.offsetTop)
  }

  render() {
    return (
      <Fragment>
        <body>
          <header>
            <div className="wrapper header-content">

              <div className="header-text">

                <h1 tabIndex="1">Next on Shuffle</h1>
                  <div className="app-description" tabIndex="2">
                    <p className="subtitle">New music is waiting for you.</p>
                    <p>Discover new music with the music you already love. Enter your favourite artist or band to get started</p>
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
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={500}>
                      <button onClick={this.handleClick}>Search</button>
                    </Link>
                  </form>

                  : 

                  <div className="header-reset">
                    <p>Want more music?</p>
                    <button onClick={this.resetForm} className="header-reset-button" aria-labelledby="After clicking on this button, you will be taken to related artist content">Search for another artist</button>
                  </div>
                  }

                  {this.state.isArtistUnknown ? <p></p> : <p tabIndex="3">We couldn't find your requested artist. Please double check spelling or search for another artist</p>}
              </div>
            </div>
          </header>
          
          <main role="status" aria-live="polite">
            <div className="wrapper">
              <section className="related-artists" id="related-artists">
                {this.state.isHidden ? <div></div> : 
                  <div className="search-results">
                    <h2 ref={this.headingElement}>Related Artists</h2>

                    <ul className="related-artist-results">
                        {this.state.relatedArtistInfo.map((info, i) => {
                        let imageUrl = info.image[3]['#text'];
                        return (
                          <RelatedArtists index={i} imageUrl={imageUrl} artist={info.artist.name} albumUrl={info.artist.url} playCount={info.playcount} albumName={info.name} scrollToMyRef={this.scrollToMyRef}/>)
                      })}
                    </ul>
                  </div>
                }
              </section>
              
              <section className="related-tracks">
                {this.state.isHidden ? <div></div> : 
                  <div className="top-tracks">
                    <h2>Top Tracks for {this.state.userArtist}</h2>
                    <ul className="related-artist-tracks">
                      {this.state.relatedArtistTracks.map((track) => {
                        return(
                          track.map((index) => {
                            return (
                              <RelatedTracks headingRef={this.headingElement} songName={index.name} songUrl={index.url} />
                            )
                          })
                        )
                      })}
                    </ul>
                    <button type="reset" onClick={this.resetForm} className="section-reset-button">Search Again</button>
                  </div>
                }
              </section>
            </div>
          </main>
          <footer>
            {this.state.isHidden ? <div></div> : 
              <div className="footer-text">
                <p>Designed and coded by <a href="https://twitter.com/andrea_codes">andrea_codes</a></p>
                <p> &copy; 2019</p>
              </div>
            }
          </footer>
        </body>
      </Fragment>
    );
  }
}

export default App;
