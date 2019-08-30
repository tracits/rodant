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
			search: '',
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

	changeSearchText(e) {
		this.setState({
			search: e.target.value
		})
	}
	
	clearSearchText() {
		this.setState({
			search: ''
		})
	}

	render() {
		var searchHits = {}
		var records = this.state.records
			// Filter on search term	
			.filter(d => {
				
				if (this.state.search === '')
					return true

				const keys = Object.keys(d)
				let hit = false
				let hits = []

				for (var k of keys) {
					if (d[k].toString().indexOf(this.state.search) !== -1) {
						hit = true
						hits.push(k)
					}
				}

				if (hit) {
					searchHits[d.uid] = hits
					return true
				}

				return false;
			})
			.map(d => 
				<Link key={d.uid} to={'/record/' + d.uid} className="list-item has-background-white">
					<span className="is-left">{d.uid}. {d.name}</span>
					<span className="hits">{searchHits[d.uid] && searchHits[d.uid].map(e => <span>{e}</span>) }</span>
					<button onClick={e => { e.preventDefault(); this.deleteRecord(d.uid); }} className="button is-danger is-small is-outlined is-pulled-right is-rounded hide-until-parent-hovered">
						<span className="fa fa-remove" />
					</button>
				</Link>
			)

		return (
			<div className=''>
				<h2 className="title">Pick record ({records.length})</h2>
				<div className='search'>
					<input className='input is-primary' type='text' value={this.state.search} onChange={(e) => this.changeSearchText(e)}/>
					<button className='button is-rounded' onClick={() => this.clearSearchText()}><span className="fa fa-remove"></span></button>
				</div>
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
