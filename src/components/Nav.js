import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Nav({ name, version }) {
	const [isDark, setIsDark] = useState(false)

	useEffect(() => {
		if (isDark) {
			document.querySelector('body').setAttribute('class', 'dark-theme')
		} else {
			document.querySelector('body').setAttribute('class', 'light-theme')
		}
	}, [isDark])

	const ThemeButton = (isDark) => {
		return isDark ? (
			<button
				type="button"
				class="navigation-bar-item"
				onClick={() => setIsDark((prevValue) => !prevValue)}
			>
				Theme
			</button>
		) : (
			<button
				type="button"
				class="navigation-bar-item"
				onClick={() => setIsDark((prevValue) => !prevValue)}
			>
				Theme
			</button>
		)
	}

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
				<ThemeButton />
			</div>
		</nav>
	)
}

export default Nav
