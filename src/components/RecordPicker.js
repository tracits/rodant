import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { exportCSV, importCSV } from '../functions/csv'
import download from '../functions/download'
import { FilePicker } from 'react-file-picker'
import { validateRecord, isValid } from '../functions/validation'
import Helmet from 'react-helmet'

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
			sortField: this.props.config.id_field,
			sortOrder: 1,
			pageSize: 10,
			page: 0,
			includeUnknown: false,
		}
	}

	async componentDidMount() {
		await this.updateRecords()
	}

	async updateRecords() {
		let records = await this.props.db.records.toArray()
		this.setState({ records: records })
	}

	async createRecord() {
		let recordId = await this.props.db.records.add({
			name: 'Unnamed',
		})

		this.props.history.push('/record/' + recordId)
		this.updateRecords()
	}

	async deleteRecord(uid) {
		if (window.confirm(`Really delete record: ${uid}?`)) {
			await this.props.db.records
				.where('uid')
				.equals(uid)
				.delete()

			this.updateRecords()
		}
	}

	exportAndDownloadCSV() {
		let csv = exportCSV(
			this.props.codebook,
			this.state.records.filter(d =>
				isValid(validateRecord(d, this.props.codebook))
			)
		)
		download(csv, 'database.csv')
	}

	async importCSVText(text) {
		try {
			await importCSV(text, this.props.db)
			this.updateRecords()
		} catch (err) {
			console.log('error', err)
			alert('Error when importing database: ' + err)
		}
	}

	async importCSV(fo) {
		if (fo.text) {
			let text = await fo.text()
			this.importCSVText(text)
		} else {
			// For safari that lacks the .text() call
			var fileReader = new FileReader()
			fileReader.addEventListener('loadend', e => {
				var text = e.srcElement.result
				this.importCSVText(text)
			})
			fileReader.readAsText(fo)
		}
	}

	changeSearchText(e) {
		this.setState({
			search: e.target.value,
			page: 0,
		})
	}

	clearSearchText() {
		this.setState({
			search: '',
			page: 0,
		})
	}

	onSearchFieldChanged(e) {
		this.setState({
			searchField: e.target.value,
			page: 0,
		})
	}

	onSortFieldChanged(e) {
		this.setState({
			sortField: e.target.value,
			page: 0,
		})
	}

	onSortOrderChanged(e) {
		this.setState({
			sortOrder: e.target.checked ? -1 : 1,
			page: 0,
		})
	}

	onIncludeUnknownChanged(e) {
		this.setState({
			includeUnknown: e.target.checked,
			page: 0,
		})
	}

	getList(str) {
		return str
			.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
			.map(d => d.replace(/"/g, ''))
	}

	getFieldText(codebook, record, fieldName) {
		let field = codebook.find(d => d.name === fieldName)
		if (
			field.type === 'qualitative' &&
			field.valid_values &&
			field.value_labels
		) {
			let values = this.getList(field.valid_values).map(d => parseInt(d))
			let labels = this.getList(field.value_labels)
			let value = parseInt(record[fieldName])
			return labels[values.find(d => d.toString() === value.toString())]
		}

		if ((record[fieldName] || '').toString() === '999') return 'unknown'

		return record[fieldName]
	}

	onPageChange(page) {
		this.setState({
			page: parseInt(page),
		})
	}

	async cleanUpInvalidRecords(silent = false) {
		// Removes records that are not valid from database
		// Find invalid records
		let records = await this.props.db.records.toArray()
		let toDelete = []

		for (let record of records) {
			let validation = validateRecord(record, this.props.codebook)
			if (!isValid(validation)) toDelete.push(record.uid)
		}

		if (toDelete.length === 0) {
			// No invalid records were found
			if (!silent) alert('No invalid records to delete.')
		} else {
			// Found invalid records, if not in silent mode ask to delete them
			if (
				silent ||
				window.confirm('Really delete ' + toDelete.length + ' records?')
			) {
				// Delete from db
				await this.props.db.records
					.where('uid')
					.anyOf(...toDelete)
					.delete()

				// Update view of records
				this.updateRecords()
			}
		}
	}

	render() {
		let searchHits = {}
		let filteredRecords = this.state.records
			// Filter on search term
			.filter(d => {
				// If not checked, do not include records with sortField unknown
				if (!this.state.includeUnknown) {
					let value = d[this.state.sortField] || ''
					if (value.toString() === '999' || value === '') return false
				}

				// Search is empty show all records
				if (this.state.search === '') return true

				const keys = Object.keys(d)
					// If there is a searchField selected, use only keys matching it
					.filter(
						d => this.state.searchField === '' || d === this.state.searchField
					)
				let hit = false
				let hits = []

				for (let k of keys) {
					if (
						d[k]
							.toString()
							.toLowerCase()
							.indexOf(this.state.search) !== -1
					) {
						hit = true
						const field = this.props.codebook.find(d => d.name === k)
						if (field)
							// Sometimes fields do not exist in codebook
							hits.push([field.label, d[k].toString()])
					}
				}

				if (hit) {
					searchHits[d.uid] = hits
					return true
				}

				return false
			})
			.sort((a, b) => {
				if (a[this.state.sortField] > b[this.state.sortField])
					return -this.state.sortOrder
				else if (a[this.state.sortField] === b[this.state.sortField]) return 0

				return this.state.sortOrder
			})

		let pageCount = Math.ceil(filteredRecords.length / this.state.pageSize)
		let page = Math.min(this.state.page, pageCount - 1)

		let records = filteredRecords
			// Paging
			.slice(
				this.state.page * this.state.pageSize,
				(this.state.page + 1) * this.state.pageSize
			)
			.map(d => {
				let validation = validateRecord(d, this.props.codebook)
				let issues = Object.keys(validation)
					.filter(d => !validation[d].valid)
					.map(d => [d, validation[d]])

				let issueDisplay = null

				if (issues.length > 0) {
					issueDisplay = (
						<span className="issues">
							<span className="fa fa-warning issues" />
							<span>{issues.length}</span>
						</span>
					)
				}

				return (
					<Link
						key={d.uid}
						to={'/record/' + d.uid}
						className="list-item has-background-white"
					>
						<span className="pid">
							{d.locked === true && <span className="fa fa-lock"> </span>}{' '}
							{d.pid} {issueDisplay}
						</span>
						<span className="hits">
							{searchHits[d.uid] &&
								searchHits[d.uid].slice(0, 10).map((e, i) => (
									<span key={i}>
										{e[0]}: {e[1]}
									</span>
								))}
						</span>
						<span className="sort-field">
							{this.getFieldText(this.props.codebook, d, this.state.sortField)}
						</span>
						<button
							onClick={e => {
								e.preventDefault()
								this.deleteRecord(d.uid)
							}}
							className="button is-danger is-small is-outlined is-rounded remove"
						>
							<span className="fa fa-remove" />
						</button>
					</Link>
				)
			})

		return (
			<div className="">
				<Helmet>
					<title>{`${this.props.config.name} - Records`}</title>
				</Helmet>
				<h2 className="title">Pick record ({records.length})</h2>
				<div className="search">
					<span className="fa fa-search"></span>
					<input
						className="input is-primary"
						type="text"
						value={this.state.search}
						onChange={e => this.changeSearchText(e)}
					/>
					<div className="select is-primary search-field">
						<select
							value={this.state.searchField}
							onChange={e => this.onSearchFieldChanged(e)}
						>
							<option default value="" key="default">
								All fields
							</option>
							{this.props.codebook
								.filter(d => d.input === 'yes' && d.calculated === 'no')
								.map(d => (
									<option value={d.name} key={d.name}>
										{d.label}
									</option>
								))}
						</select>
					</div>
					<button
						className="button is-rounded"
						onClick={() => this.clearSearchText()}
					>
						<span className="fa fa-remove"></span>
					</button>
				</div>
				<div className="sort">
					<div className="paging">
						<button
							className="button is-primary is-small"
							disabled={page === 0}
							onClick={e => this.onPageChange(Math.max(0, page - 1))}
						>
							&lt;
						</button>
						<input
							className="input is-small is-primary"
							type="text"
							value={this.state.page + 1}
							onChange={e => this.onPageChange(e.target.value)}
						></input>
						<span>/</span>
						<span>{pageCount}</span>
						<button
							className="button is-primary is-small"
							disabled={page === pageCount - 1}
							onClick={e => this.onPageChange(Math.min(pageCount, page + 1))}
						>
							&gt;
						</button>
					</div>
					<div className="select is-primary sortField">
						<select
							className="select"
							value={this.state.sortField}
							onChange={e => this.onSortFieldChanged(e)}
						>
							{this.props.codebook.map(d => (
								<option value={d.name} key={d.name}>
									{d.label}
								</option>
							))}
						</select>
					</div>
					<div className="control">
						<input
							type="checkbox"
							className="checkbox"
							checked={this.state.sortOrder !== 1}
							onChange={e => this.onSortOrderChanged(e)}
						/>
						<label> Ascending</label>
					</div>
					<div className="control">
						<input
							type="checkbox"
							className="checkbox"
							checked={this.state.includeUnknown}
							onChange={e => this.onIncludeUnknownChanged(e)}
						/>
						<label> Include unknown</label>
					</div>
				</div>
				<div className="list is-hoverable">{records}</div>

				<div className="buttons">
					<button
						className="button is-primary is-rounded"
						onClick={() => {
							this.createRecord()
						}}
					>
						Create Record
					</button>
					<button
						className="button is-rounded"
						onClick={() => {
							this.cleanUpInvalidRecords()
						}}
					>
						Delete invalid records
					</button>
					<button
						className="button is-rounded"
						onClick={() => {
							this.exportAndDownloadCSV()
						}}
					>
						Export as CSV
					</button>

					<div className="fileUploader">
						<FilePicker
							extensions={['csv']}
							onChange={fo => this.importCSV(fo)}
							onError={err => console.log('Upload error', err)}
						>
							<button className="button is-rounded">Import from CSV</button>
						</FilePicker>
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(RecordPicker)
