import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';

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
						<a href={this.props.albumUrl}>
							<img src={this.props.imageUrl} alt=""/>
						</a>
					</div>

					<div className="album-info">
						<a href={this.props.albumUrl} className="album-link">
							<p>Listen to {this.props.albumName}</p>
						</a>
						<p>Plays:{this.props.playCount}</p>
					</div>
				</div>
				<i class="far fa-play-circle"></i>
				<div className="top-tracks">
					{this.props.albumTracks}
				</div>
			</li>
		)
	}
}

export default RelatedArtists;

// 