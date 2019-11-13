/**
 * Download a string as a text file
 * Defaults to 'application/octet-stream'
 */

export default function(
	data,
	filename,
	prefix = 'data:application/octet-stream,'
) {
	// Encode data
	let encoded = encodeURIComponent(data)

	// Create element with href and download attributes
	let el = document.createElement('A')
	document.body.appendChild(el)
	el.setAttribute('href', prefix + encoded)
	el.setAttribute('download', filename)

	// Virtually click it to have the browser start download
	el.click()

	// Remove element
	el.remove()
}
