import React, { Component } from 'react';


class RelatedArtists extends Component {
	constructor(){
		super();
	}
	
	componentDidMount(){
		this.props.scrollToMyRef();
	}

	render(){
		return (
			<div className="related-artist-result" >
				<div className="album-image">
					<h3>{this.props.artist}</h3>
					<img src={this.props.imageUrl} alt=""/>
					<a href={this.props.albumUrl}>Check out</a>
					<p>Album Name: {this.props.albumName}</p>
					<p>This album has been played:{this.props.playCount}</p>
				</div>
					
				<div className="top-tracks">
					{this.props.albumTracks}
				</div>
			</div>
		)
	}
}

export default RelatedArtists;

// 