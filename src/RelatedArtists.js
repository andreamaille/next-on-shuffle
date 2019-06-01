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
			<li className="related-artist-card">
				<div className="inner-wrapper">
					<h3>{this.props.artist}</h3>
					<div className="image-container">
						<img src={this.props.imageUrl} alt=""/>
					</div>
					<div className="album-info">
						<a href={this.props.albumUrl}>Check out</a>
						<p>Album Name: {this.props.albumName}</p>
						<p>This album has been played:{this.props.playCount}</p>
					</div>
				</div>
					
				<div className="top-tracks">
					{this.props.albumTracks}
				</div>
			</li>
		)
	}
}

export default RelatedArtists;

// 