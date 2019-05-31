import React from 'react'


const RelatedArtists = (props) => {

	return (
		<div className="related-artist-result">

			<div className="album-image">
				<h3>{props.artist}</h3>
				<img src={props.imageUrl} alt="" />
				<a href={props.albumUrl}>Check out</a>
				<p>Album Name: {props.albumName}</p>
				<p>Album played: {props.playCount}</p>
			</div>
			
				
			<div className="top-tracks">
				{props.albumTracks}
			</div>

		</div>
	)
}

export default RelatedArtists;