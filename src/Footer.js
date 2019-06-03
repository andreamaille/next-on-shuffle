import React, { Fragment } from 'react'
import Animation from './Animation.js'

const Footer = (props) => {
	return (
		<Fragment>
			<footer>
				<div className="footer-text">
					<Animation />
					<p> &copy; 2019</p>
					<p>Designed and coded by <a href="https://twitter.com/andrea_codes">andrea_codes</a></p>
				</div>
			</footer>
		</Fragment>
	)
}

export default Footer;