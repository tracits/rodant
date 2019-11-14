/**
 * Converts the IDC10 fixed column width text format to json
 */

const fs = require('fs')

var inputPath = process.argv[2]
var outputPath = process.argv[3] || '../src/data/icd10.json'

if (!inputPath || !outputPath) {
	console.log(
		'Usage: node icd10importer.js <input filename> <optional: output filename, default: ../src/data/icd10.json>'
	)
	process.exit(1)
}

var data = fs
	.readFileSync(inputPath)
	.toString()
	.split('\n')

var output = {}

for (let i = 0; i < data.length; i++) {
	let code = data[i].substr(0, 8).trim()
	let description = data[i].substr(8).trim()

	if (output && description) output[code] = description
}

var json = JSON.stringify(output)

fs.writeFileSync(outputPath, json)
console.log(`Wrote ${data.length} codes to ${outputPath}`)
