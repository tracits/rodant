const unset = '<unset>' // The value to use when a value is not defined in the record
const csv_separator = ',' // Between fields
const csv_encloser = '"' // Enclosing fields
const csv_row_break = '\n' // Line break

function serializeField(v) {
	return csv_encloser +
		v.toString()
			.replace(/"/gi, '""') // Double up double quotes
			.replace(/'/gi, "''") // Double up single quotes
		+ csv_encloser
}

/**
 * Creates a CSV string for the supplied records
 * @param {[]} codebook - codebook definition
 * @param {[]} records  - set of records
 * @returns {string}    - csv formatted string
 */
function exportCSV(codebook, records) {
	let data = []
	let headers = data[0] = []
	
	// Add headers
	for (let c of codebook)
		headers.push(serializeField(c.name))
	
	// Add data
	for (let r of records) {
		let row = []
		
		for (let c of codebook)
			row.push(serializeField(r[c.name] || unset))

		data.push(row)
	}

	// Create string
	let result = ''
	for (let r of data)
		result += r.join(csv_separator) + csv_row_break

	// Return the result
	return result
}


export {
	exportCSV,
}
