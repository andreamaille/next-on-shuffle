import React, { Fragment } from 'react'

const PreviousSearches = (props) => {
  return (
    <Fragment>
        <li key={props.index}>
          <p>{props.previousArtist}</p>
        </li>
    </Fragment>
  )
}

export default PreviousSearches;
