import React from 'react'


const Results = (props) => {

	return (
		
		<div className="related-artist-result">
			<div className="album-image">
				<img src={props.imageUrl} alt="" />
			</div>
			
			<div className="artist-name">{props.artistName}</div>
				
			<div className="top-tracks">
				<li>{props.albumTracks}</li>
			</div>

			
		</div>
	)
}

export default Results;