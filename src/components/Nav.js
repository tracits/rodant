import React from 'react'
import { Link } from 'react-router-dom'

import useDarkMode from './Hooks/useDarkMode'

function Nav({ name, version }) {
	const { theme, toggleTheme, componentMounted } = useDarkMode()

	const ThemeButton = () => {
		return theme === 'light' ? (
			<button
				type="button"
				className="navigation-bar-button"
				onClick={toggleTheme}
			>
				{'🌘'}
			</button>
		) : (
			<button
				type="button"
				className="navigation-bar-button"
				onClick={toggleTheme}
			>
				{'🌖'}
			</button>
		)
	}

	return (
		<>
			{componentMounted ? (
				<nav className="navigation-bar">
					<div className="navigation-bar-contatiner">
						<div className="navigation-bar-brand">{name}</div>
						<Link to="/">
							<button type="button" className="navigation-bar-button">
								Records
							</button>
						</Link>
						<div>
							<ThemeButton />
						</div>
					</div>
					<div className="navigation-bar-version">
						<a href="https://github.com/tracits/rodant/blob/master/CHANGELOG.md">
							Built with Rodant (v.{version})
						</a>
					</div>
				</nav>
			) : null}
		</>
	)
}

export default Nav
