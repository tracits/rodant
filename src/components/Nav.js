import React from 'react'
import { Link } from 'react-router-dom'

function Nav({ name, version }) {
	return (
		<nav className="navigation-bar">
			<div className="navigation-bar-brand">
				{name} ({version})
			</div>
			<Link to="/">
				<button type="button" className="navigation-bar-item">
					Records
				</button>
			</Link>
			<div>
				<button type="button" class="navigation-bar-item">
					Theme
				</button>
			</div>
		</nav>
	)
}

export default Nav
