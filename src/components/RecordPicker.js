import React from 'react'
import { Link } from 'react-router-dom'
import { exportCSV, importCSV } from '../functions/csv'
import download from '../functions/download'
import { FilePicker } from 'react-file-picker'

/**
 * Renders a list of the available records.
 * Clicking a record will take you to the corresponding RecordEditor page.
 * User can also create records here.
 */
class RecordPicker extends React.Component {
	constructor(props) {
		super(props)
		
		this.state = {
			records: [],
		}
	}

	async componentDidMount() {
		await this.updateRecords()
	}

	async updateRecords() {
		var records = await this.props.db.records
			.toArray();
		this.setState({ records: records })
	}

	async createRecord() {
		await this.props.db.records.add({
			name: "Unnamed", 
		})

		this.updateRecords()
	}

	async deleteRecord(uid) {
		if (window.confirm(`Really delete record: ${uid}?`)) {
			await this.props.db.records
				.where('uid').equals(uid)
				.delete()
	
			this.updateRecords()
		}
	}
	
	exportAndDownloadCSV() {
		var csv = exportCSV(this.props.codebook, this.state.records)
		download(csv, 'database.csv')
	}

	async importCSV(fo) {
		let text = await fo.text()
		try {
			let res = await importCSV(text, this.props.db)
			this.updateRecords()
		} catch (err) {
			console.log("error", err)
			alert("Error when importing database: " + err)
		}
		
	}

	render() {
		var records = this.state.records.map(d => 
			<Link key={d.uid} to={'/record/' + d.uid} className="list-item has-background-white">
				<span className="is-left">{d.uid}. {d.name}</span>
				<button onClick={e => { e.preventDefault(); this.deleteRecord(d.uid); }} className="button is-danger is-small is-outlined is-pulled-right is-rounded hide-until-parent-hovered">
					<span className="fa fa-remove" />
				</button>
			</Link>
		)

		return (
			<div className=''>
				<h2 className="title">Pick record ({records.length})</h2>
				<div className='list is-hoverable'>
					{records}
				</div>

				<div className='buttons'>
					<button className="button is-primary is-rounded" onClick={() => { this.createRecord() }}>Create Record</button>
					<button className="button is-rounded" onClick={() => { this.exportAndDownloadCSV() }}>Export as CSV</button>

					<div className="fileUploader">
						<FilePicker	
							extensions={['csv']}
							onChange={ fo => this.importCSV(fo )}
							onError={ err => console.log('Upload error', err) }
						>
							<button className="button is-rounded">Import from CSV</button>
						</FilePicker>
					</div>
				</div>
			</div>
		)
	}
}

export default RecordPicker
