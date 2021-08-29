import React, { useState } from 'react'
import Spinner from './Spinner'
import { FilePicker } from 'react-file-picker'
import { importCSV } from '../functions/csv'
import Dialogue from './Dialogue'

function ButtonContainer({
	createRecord,
	cleanUpInvalidRecords,
	exportAndDownloadCSV,
	isLoading,
	setLoading,
	updateRecords,
	db,
}) {

	const [isImportDialogueActive, setImportDialogueActive] = useState(false)
	const [csvImportFile, setCsvImportFile] = useState(null)

	function toggleImportDialogue() {
		setImportDialogueActive(!isImportDialogueActive)
	}

	async function importCSVText(text) {
		setLoading(true)
		try {
			console.log(text)
			await importCSV(text, db)
			console.log(db)
			updateRecords()
		} catch (err) {
			console.log('error', err)
			alert('Error when importing database: ' + err)
			setLoading(false)
		}
		return setLoading(false)
	}

	async function handleCsvImport() {
		// Close dialogue
		toggleImportDialogue()
		if (!csvImportFile) return
		if (csvImportFile.text) {
			let text = await csvImportFile.text()
			importCSVText(text)
		} else {
			// For safari that lacks the .text() call
			var fileReader = new FileReader()
			fileReader.addEventListener('loadend', (e) => {
				var text = e.srcElement.result
				importCSVText(text)
			})
			fileReader.readAsText(csvImportFile)
		}
	}

	function openImportDialogue(importCsvFile) {
		toggleImportDialogue()
		setCsvImportFile(importCsvFile)
	}

	return (
		<div className="button-container">
			<div className="buttons">
				<button className="button is-primary " onClick={createRecord}>
					Create Record
				</button>
				<button className="button " onClick={cleanUpInvalidRecords}>
					Delete invalid records
				</button>
				<button className="button " onClick={exportAndDownloadCSV}>
					Export as CSV
				</button>
				<Dialogue
					title={
						"Importing may overwrite data. Continue?"
					}
					isDialogueActive={isImportDialogueActive}
					toggleDialogue={toggleImportDialogue}
					onConfirm={handleCsvImport}
				/>
				<div className="fileUploader">
					<FilePicker
						extensions={['csv']}
						maxSize={100}
						onChange={(importCsvFile) => openImportDialogue(importCsvFile)}
						onError={(err) => {
							console.log('Upload error', err)
							alert(err.toString())
						}}
					>
						<button
							className="button "
						>
							Import from CSV
						</button>
					</FilePicker>
				</div>
				{isLoading ? <Spinner /> : null}
			</div>
		</div>
	)
}

export default ButtonContainer
