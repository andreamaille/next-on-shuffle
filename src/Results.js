import React from 'react'


const Results = (props) => {

	return (
		
		<div className="related-artist-result">
			<div className="album-image">
				<h2>{props.artist}</h2>
				<img src={props.imageUrl} alt="" />
			</div>
			
				
			<div className="top-tracks">
				{props.albumTracks}
			</div>

			
		</div>
	)
}

export default Results;