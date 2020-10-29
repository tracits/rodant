import React from 'react'
import { Link } from 'react-router-dom'

import useDarkMode from './Hooks/useDarkMode'

type Props = {
	version: string,
	name: string
}



function Nav({ name, version }: Props) {
	const { theme, toggleTheme, componentMounted } = useDarkMode()

	const ThemeButton = () => {
		return theme === 'light' ? (
			<div style={{paddingLeft:'1rem'}} >
			<button
				className="button is-primary is-active"
				onClick={toggleTheme}
				>
				{'🌘'}
			</button>
			</div>
		) : (
			<div style={{paddingLeft:'1rem'}} >
			<button
				className="button is-primary is-active"
				onClick={toggleTheme}
				>
				{'🌖'}
			</button>
				</div>
		)
	}

	return (
		<>
			{componentMounted ? (
				<nav className="navigation-bar">
					<div className="navigation-bar-contatiner">
						<div className="navigation-bar-brand">{name}</div>
						<Link to="/">
							<button  className="button is-primary is-active">
								Records
							</button>
						</Link>

							<ThemeButton />

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
