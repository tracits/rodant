async function search(code) {
	let database = await import('../data/icd10.json')
	if (database[code])
		return [[code, database[code]]]

	return Object.keys(database)
		.filter(d => d.startsWith(code))
		.map(d => [d, database[d]])
}

export default search