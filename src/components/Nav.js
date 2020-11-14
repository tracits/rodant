import React from 'react'
import { Link } from 'react-router-dom'

import useDarkMode from './Hooks/useDarkMode'

function Nav({ name, version }) {
	const { theme, toggleTheme, componentMounted } = useDarkMode()

	const ThemeButton = () => {
		return theme === 'light' ? (
			<button type="button" className="button is-info" onClick={toggleTheme}>
				{'🌖'}
			</button>
		) : (
			<button type="button" className="button is-info" onClick={toggleTheme}>
				{'🌖'}
			</button>
		)
	}

	return (
		<>
			{componentMounted ? (
				<nav
					className="navbar is-primary"
					role="navigation"
					aria-label="main navigation"
				>
					<div className="navbar-brand">
						<div className="navbar-brand navbar-item">{name}</div>
						<Link className="navbar-item" to="/">
							Records
						</Link>
					</div>
					<div className="navbar-menu">
						<div className="navbar-start">
							<a
								href="https://github.com/tracits/rodant/blob/master/CHANGELOG.md"
								className="navbar-item"
							>
								What's New
							</a>

							<div className="navbar-item has-dropdown is-hoverable">
								<a className="navbar-link">More</a>
								<div className="navbar-dropdown">
									<a className="navbar-item">About</a>
									<a className="navbar-item">Jobs</a>
									<a className="navbar-item">Contact</a>
									<hr className="navbar-divider" />
									<strong className="navbar-item">v.{version}</strong>
								</div>
							</div>
						</div>

						<div className="navbar-end">
							<div className="navbar-item ">
								<ThemeButton />
							</div>

							{/* <div className="buttons ">
								<a
									className="button is-light"
									href="https://github.com/tracits/rodant"
								>
									<strong>Built with Rodant (v.{version})</strong>
								</a>
							</div> */}
						</div>
					</div>
				</nav>
			) : null}
		</>
	)
}

export default Nav
