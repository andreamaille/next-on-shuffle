import React, { Component, Fragment } from 'react';
import axios from 'axios'
import './styles/App.scss';
import RelatedArtists from './RelatedArtists.js'
import RelatedTracks from './RelatedTracks.js'
import { Link, animateScroll as scroll } from "react-scroll";


class App extends Component {
  constructor () {
    super();
    this.headingElement = React.createRef();
    this.state = {
      isLoading:true,
      isHidden:true,
      isReset: true,
      chosenArtist:'',
      userInput:'',
      similarArtistName:[],
      artistInfo:[],
      artistTracks:[],
      artistUnknown:true
    }
  }

  componentDidMount() {
    this.setState({
      isLoading:false,

    })
  }

  scrollToMyRef = () => window.scrollTo(0, this.headingElement.current.offsetTop) 

  searchError = () => {
    this.setState({
      artistUnknown: false,
    })
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
        similarArtists: response,
      }, () => {
        // console.log(this.state.similarArtists);
        this.getArtistInfo();
        
      });

    }).catch(error => {
      console.log('failed');
      this.searchAgain();
      this.searchError();
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

  // on click of the submit button
  handleClick = (event) => {
    event.preventDefault();

    const userArtist = this.state.userInput;

    this.setState({
      userInput: '',
      chosenArtist: userArtist,
      isHidden:false,
    }, () => {
      this.callApiSimilarArtists();
      this.resetButton();
      
    })
  }

  resetButton = () => {
    this.setState({
      isReset: false,
      artistUnknown:true,
    })
  }

  searchAgain = () => {
    this.setState({
      isReset:true, 
      chosenArtist: '',
      isHidden: true,
      chosenArtist: '',
      userInput: '',
      similarArtistName: [],
      artistInfo: [],
      artistTracks: [],
    })
  }

  handleChange = (event) => {
    this.setState({
      userInput: event.target.value
    })
  }

  

  render() {

    return (
      <Fragment>
        {this.state.isLoading ? (<p>Loading... </p>) : (
        <div className="App">
          <header>
            <div className="wrapper header-content">
              <div className="header-text">
                <h1 tabIndex="1">Next on Shuffle</h1>
                  <div className="app-description" tabIndex="2">
                    <p className="subtitle">New music is waiting for you.</p>
                    <p>Discover new music with the music you already love. Enter your favourite artist or band to get started</p>
                </div>


                {this.state.isReset ?
                <form action="">

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
                    duration={500}
                  >
                    <button onClick={this.handleClick}>Search</button>
                  </Link>
                  </form>
                  : <button onClick={this.searchAgain} aria-describedby="After clicking on this button, you will be taken to related artist content">Search for another artist</button>}

                  {this.state.artistUnknown ? <p></p> : <p tabIndex="3">We couldn't find your requested artist. Please double check spelling or search for another artist</p>}

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
                      {this.state.artistInfo.map((info, i) => {
                        let imageUrl = info.image[3]['#text'];
                        return (
                          <RelatedArtists index={i} imageUrl={imageUrl} artist={info.artist.name} albumUrl={info.artist.url} playCount={info.playcount} albumName={info.name} scrollToMyRef={this.scrollToMyRef}/>
                        )
                      })}
                    </ul>
                  </div>
              }
              </section>


              <section className="related-tracks">
                {this.state.isHidden ? <div></div> : 

                <div className="top-tracks">
                    <h2>Top Tracks for {this.state.chosenArtist}</h2>
                    {this.state.artistTracks.map((track) => {
                      return (
                        track.map((index) => {
                          return (
                            <RelatedTracks headingRef={this.headingElement} albumTracks={index.name} />
                          )
                        })
                      )
                    })}
                    <button type="reset" onClick={this.searchAgain}>Reset</button>
                </div>
              }
              </section>
            </div>
          </main>
        </div>
        )
      }
      </Fragment>
    );
  }
}

export default App;
