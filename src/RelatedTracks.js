import React, { Fragment } from 'react'

const RelatedTracks = (props) => {
  return (
    <Fragment>
			<li className="related-tracks-names">
				<a href={props.songUrl} className="related-track-links">
						{props.songName}
				</a>
			</li>
  </Fragment>
  )
}

export default RelatedTracks;