import React from 'react'
import { Link } from 'react-router-dom'

import useDarkMode from './Hooks/useDarkMode'

function Nav({ name, version }) {
	const {theme ,toggleTheme, componentMounted } = useDarkMode()

	const toggleMenuIsActive = () => {
		document.getElementById('burger').classList.toggle('is-active')
		document.getElementById('nav-bar-menu').classList.toggle('is-active')
		document.getElementById('more-menu').classList.toggle('is-hidden')
	}

	return (
		<>
			{componentMounted ? (
				<nav
					className={`navbar  ${theme === 'dark' ? 'is-dark' : 'is-primary'}`}
					role="navigation"
					aria-label="main navigation"
				>
					<div className="navbar-brand">
						<div className=" navbar-item">{name}</div>
						<Link className="navbar-item" to="/">
							Records
						</Link>
						<a
							role="button"
							onClick={toggleMenuIsActive}
							id="burger"
							className="navbar-burger"
							data-target="navMenu"
							aria-label="menu"
							aria-expanded="false"
							href
						>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>
					<div className="navbar-menu" id="nav-bar-menu">
						<div className="navbar-item has-dropdown is-hoverable">
							<div className="navbar-link navbar-menu-white" id="more-menu">
								More
							</div>
							<div className="navbar-dropdown">
								<a className="navbar-item is-white" onClick={toggleTheme} href>
									Toggle Dark Mode
								</a>
								<a
									href="https://github.com/tracits/rodant"
									className="navbar-item"
									rel="noopener noreferrer"
									target="_blank"
								>
									About
								</a>
								<a
									href="https://github.com/tracits/rodant/blob/master/CHANGELOG.md"
									className="navbar-item"
									rel="noopener noreferrer"
									target="_blank"
								>
									What's New
								</a>
								<hr className="navbar-divider" />
								<strong className="navbar-item">v.{version}</strong>
							</div>
						</div>
					</div>
				</nav>
			) : null}
		</>
	)
}

export default Nav
