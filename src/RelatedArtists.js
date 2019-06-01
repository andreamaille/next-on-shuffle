import React, { Component } from 'react';

class RelatedArtists extends Component {

	// for accessibility, to ensure that screen readers are taken to the beginning of the dynamic content
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
			</li>
		)
	}
}

export default RelatedArtists;

