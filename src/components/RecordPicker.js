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
			searchField: '',
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

	onSearchFieldChanged(e) {
		this.setState({
			searchField: e.target.value
		})
	}

	render() {
		let searchHits = {}
		let search = this.state.search.toLowerCase()
		let records = this.state.records
			// Filter on search term	
			.filter(d => {
				// Search is empty show all records
				if (this.state.search === '')
					return true

				const keys = Object.keys(d)
					// If there is a searchField selected, use only keys matching it
					.filter(d => this.state.searchField === '' || d === this.state.searchField)
				let hit = false
				let hits = []

				for (var k of keys) {
					if (d[k].toString().toLowerCase().indexOf(this.state.search) !== -1) {
						hit = true
						const field = this.props.codebook.find(d => d.name === k)
						if (field) // Sometimes fields do not exist in codebook
							hits.push([field.label, d[k].toString()])
					}
				}

				if (hit) {
					searchHits[d.uid] = hits
					return true
				}

				return false;
			})
			.map(d => {
				return <Link key={d.uid} to={'/record/' + d.uid} className="list-item has-background-white">
					<span className="is-left">{d.uid}. {d.name}</span>
					<span className="hits">{searchHits[d.uid] && searchHits[d.uid].slice(0, 10).map((e, i) => <span key={i}>{e[0]}: {e[1]}</span>) }</span>
					<button onClick={e => { e.preventDefault(); this.deleteRecord(d.uid); }} className="button is-danger is-small is-outlined is-pulled-right is-rounded hide-until-parent-hovered">
						<span className="fa fa-remove" />
					</button>
				</Link>
			})

		return (
			<div className=''>
				<h2 className="title">Pick record ({records.length})</h2>
				<div className='search'>
					<span className='fa fa-search'></span>
					<input className='input is-primary' type='text' value={this.state.search} onChange={(e) => this.changeSearchText(e)}/>
					<div className='select is-primary search-field'>
						<select 
							value={this.state.searchField}
							onChange={e => this.onSearchFieldChanged(e)}
						>
							<option default value='' key='default'>All fields</option>
							{ this.props.codebook.map(d => <option value={d.name} key={d.name}>{d.label}</option>) }
						</select>
					</div>
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
