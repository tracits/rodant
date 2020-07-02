import React from 'react'
import { Link } from 'react-router-dom'

function Nav({ name, version }) {
	return (
		<nav className="navigation-bar">
			<div className=" navigation-bar-brand">
				{name} ({version})
			</div>
			<Link to="/">
				<div className="navigation-bar-item">Records</div>
			</Link>
		</nav>
	)
}

export default Nav
