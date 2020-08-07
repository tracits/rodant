import { useEffect, useState } from 'react'

export default function useDarkMode() {
	const [theme, setTheme] = useState('light')
	const [componentMounted, setComponentMounted] = useState(false)

	const setMode = (mode) => {
		window.localStorage.setItem('theme', mode)
		setTheme(mode)
	}

	const toggleTheme = () => {
		theme === 'light' ? setMode('dark') : setMode('light')
	}

	useEffect(() => {
		// manually setting the button classes that are controlled by the css framework
		if (theme === 'dark' && componentMounted) {
			document.querySelector('body').setAttribute('class', 'dark-theme')
			document.querySelectorAll('button').forEach((element) => {
				element.className.includes('button is-rounded') &&
					element.setAttribute('class', 'button is-rounded is-dark')
			})
		} else {
			document.querySelector('body').setAttribute('class', 'light-theme')
			document.querySelectorAll('button').forEach((element) => {
				element.className.includes('button is-rounded') &&
					element.setAttribute('class', 'button is-rounded')
			})
		}
	}, [theme, componentMounted])

	useEffect(() => {
		const localTheme = window.localStorage.getItem('theme')

		window.matchMedia &&
		window.matchMedia('(prefers-color-scheme: dark)').matches &&
		!localTheme
			? setMode('dark')
			: localTheme
			? setTheme(localTheme)
			: setMode('light')
		setComponentMounted(true)
	}, [])

	return { theme, toggleTheme, componentMounted }
}
