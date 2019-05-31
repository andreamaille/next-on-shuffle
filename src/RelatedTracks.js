import React from 'react'


const RelatedTracks = (props) => {

    return (
        <div className="related-artist-tracks">
            <div className="top-tracks">
                {props.albumTracks}
            </div>
        </div>
    )
}

export default RelatedTracks;