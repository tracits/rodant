import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { exportCSV, importCSV } from '../functions/csv'
import download from '../functions/download'
import {
	validateRecord,
	isValid,
	interpolateRecord,
	isUnknown,
} from '../functions/validation'
import Helmet from 'react-helmet'
import Pager from './Pager'

import ButtonContiner from './ButtonContainer'

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
			pageSize: this.props.config.page_size,
			page: 0,
			includeUnknown: false,
			includeLocked: true,
			exactMatch: false,
			loading: false,
		}
	}

	async componentDidMount() {
		await this.updateRecords()

		this.state.records.forEach((el) =>
			console.log(typeof el.locked, el.locked, el.pid)
		)
	}

	async updateRecords() {
		let records = await this.props.db.records.toArray()
		this.setState({ records: records })
	}

	async createRecord() {
		let recordId = await this.props.db.records.add({
			name: 'Unnamed',
			locked: 'FALSE',
		})

		this.props.history.push('/record/' + recordId)
		this.updateRecords()
	}

	async deleteRecord(uid) {
		if (window.confirm(`Really delete record: ${uid}?`)) {
			await this.props.db.records.where('uid').equals(uid).delete()

			this.updateRecords()
		}
	}

	async exportAndDownloadCSV() {
		await this.setLoading(true)
		setTimeout(() => {
			exportCSV(
				this.props.codebook,
				this.state.records.filter((d) => d)
			)
				.then((exportCSVResults) =>
					download(exportCSVResults, `${this.props.config.table}.csv`)
				)
				.catch((err) => console.error(`there was an Error: ${err}`))
		}, 100)
		// Hack to turn off loading state/spinner after 1.5s
		setTimeout(() => {
			this.setLoading(false)
		}, 1500)
	}

	setLoading(value) {
		return new Promise((resolve) => {
			resolve(this.setState({ loading: value }))
		})
	}

	async importCSVText(text) {
		this.setLoading(true)
		try {
			await importCSV(text, this.props.db)
			this.updateRecords()
		} catch (err) {
			console.log('error', err)
			alert('Error when importing database: ' + err)
			this.setLoading(false)
		}
		return this.setLoading(false)
	}

	async importCSV(fo) {
		if (!window.confirm('Importing might overwrite data. Continue?')) return

		if (fo.text) {
			let text = await fo.text()
			this.importCSVText(text)
		} else {
			// For safari that lacks the .text() call
			var fileReader = new FileReader()
			fileReader.addEventListener('loadend', (e) => {
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
	onIncludeLockedChanged(e) {
		this.setState({
			includeLocked: e.target.checked,
			page: 0,
		})
	}

	onExactMatchChanged(e) {
		this.setState({
			exactMatch: e.target.checked,
			page: 0,
		})
	}

	getList(str) {
		return str
			.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
			.map((d) => d.replace(/"/g, ''))
	}

	getFieldText(codebook, record, fieldName) {
		let field = codebook.find((d) => d.name === fieldName)
		if (
			field.type === 'qualitative' &&
			field.valid_values &&
			field.value_labels
		) {
			let values = this.getList(field.valid_values).map((d) => parseInt(d))
			let labels = this.getList(field.value_labels)
			let value = parseInt(record[fieldName])
			return labels[values.find((d) => d.toString() === value.toString())]
		}

		if (isUnknown(record[fieldName] || '', field)) return 'unknown'

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
		this.setLoading(true)
		let records = await this.props.db.records.toArray()
		let toDelete = []

		for (let record of records) {
			let validation = validateRecord(record, this.props.codebook)
			if (record.locked !== 'TRUE' && !isValid(validation))
				toDelete.push(record.uid)
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
				this.setLoading(false)
			}
		}
		this.setLoading(false)
	}

	render() {
		let searchHits = {}
		const sortField = this.props.codebook.find(
			(d) => d.name === this.state.sortField
		)

		let filteredRecords = this.state.records
			// Filter on search term
			.filter((d) => {
				// If not checked, do not include records that are marked as locked
				if (!this.state.includeLocked && d.locked !== 'FALSE') return false

				// If not checked, do not include records with sortField unknown
				if (!this.state.includeUnknown) {
					let value = d[this.state.sortField] || ''
					if (isUnknown(value, sortField)) return false
				}

				// Search is empty show all records
				if (this.state.search === '') return true

				let interpolatedRaw = interpolateRecord(d, this.props.codebook)
				let interpolated = {}
				for (let f of this.props.codebook)
					interpolated[f.name] = (interpolatedRaw[f.name] || '').toString()

				const keys = this.props.codebook
					.map((d) => d.name)
					// If there is a searchField selected, use only keys matching it
					.filter(
						(d) => this.state.searchField === '' || d === this.state.searchField
					)
				let hit = false
				let hits = []

				for (let k of keys) {
					if (
						interpolated.hasOwnProperty(k) &&
						interpolated[k] != null &&
						(this.state.exactMatch
							? interpolated[k].toString().toLowerCase() ===
							  this.state.search.trim()
							: interpolated[k]
									.toString()
									.toLowerCase()
									.indexOf(this.state.search) !== -1)
					) {
						hit = true
						const field = this.props.codebook.find((d) => d.name === k)
						if (field)
							// Sometimes fields do not exist in codebook
							hits.push([field.label, interpolatedRaw[k]])
					}
				}

				if (hit) {
					searchHits[d.uid] = hits
					return true
				}

				return false
			})
			.sort((a, b) => {
				// Handle quantitative values with parseInt
				if (sortField.type === 'quantitative' || sortField.name === 'pid')
					return (
						(parseInt(a[this.state.sortField]) -
							parseInt(b[this.state.sortField])) *
						-this.state.sortOrder
					)

				// Handle other values as strings
				if (a[this.state.sortField] > b[this.state.sortField])
					return -this.state.sortOrder
				else if (a[this.state.sortField] === b[this.state.sortField]) return 0

				return this.state.sortOrder
			})

		let pageCount = Math.ceil(filteredRecords.length / this.state.pageSize)
		let page = Math.max(0, Math.min(this.state.page, pageCount - 1))

		let records = filteredRecords
			// Paging
			.slice(
				this.state.page * this.state.pageSize,
				(this.state.page + 1) * this.state.pageSize
			)
			.map((d) => {
				let validation = validateRecord(d, this.props.codebook)
				let issues = Object.keys(validation)
					.filter((d) => !validation[d].valid)
					.map((d) => [d, validation[d]])

				let issueDisplay = null

				if (issues.length > 0) {
					issueDisplay = (
						<span className="issues">
							<span className="fa fa-warning issues" />
							<span>{issues.length}</span>
						</span>
					)
				}

				var locked = (d.locked || '').toString().toLowerCase() === 'true'

				return (
					<Link
						key={d.uid}
						to={'/record/' + d.uid}
						className={`list-item ${locked ? ' locked' : ''}`}
					>
						<span className="pid">
							{locked && <span className="fa fa-lock"> </span>} {d.pid}{' '}
							{issueDisplay}
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
							disabled={d.locked === 'TRUE'}
							onClick={(e) => {
								e.preventDefault()
								this.deleteRecord(d.uid)
							}}
							className={`button ${
								d.locked === 'TRUE' ? 'is-disabled' : ' is-danger'
							} is-small is-outlined is-rounded remove`}
						>
							<span className="fa fa-remove" />
						</button>
					</Link>
				)
			})

		var search = (
			<div className="search">
				<span className="fa fa-search"></span>
				<input
					className="input is-primary"
					type="text"
					value={this.state.search}
					onChange={(e) => this.changeSearchText(e)}
				/>
				<div className="select is-primary search-field">
					<select
						value={this.state.searchField}
						onChange={(e) => this.onSearchFieldChanged(e)}
					>
						<option default value="" key="default">
							All fields
						</option>
						{this.props.codebook.map((d) => (
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
		)

		var sort = (
			<div className="sort">
				<Pager
					page={page}
					max={pageCount}
					onPageChange={(e) => this.onPageChange(e)}
				></Pager>
				<div className="select is-primary sortField">
					<select
						className="select"
						value={this.state.sortField}
						onChange={(e) => this.onSortFieldChanged(e)}
					>
						{this.props.codebook.map((d) => (
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
						onChange={(e) => this.onSortOrderChanged(e)}
					/>
					<label> Ascending</label>
				</div>
				<div className="control">
					<input
						type="checkbox"
						className="checkbox"
						checked={this.state.includeUnknown}
						onChange={(e) => this.onIncludeUnknownChanged(e)}
					/>
					<label> Include unknown</label>
				</div>
				<div className="control">
					<input
						type="checkbox"
						className="checkbox"
						checked={this.state.includeLocked}
						onChange={(e) => this.onIncludeLockedChanged(e)}
					/>
					<label> Include locked</label>
				</div>
				<div className="control">
					<input
						type="checkbox"
						className="checkbox"
						checked={this.state.exactMatch}
						onChange={(e) => this.onExactMatchChanged(e)}
					/>
					<label> Exact match</label>
				</div>
			</div>
		)

		return (
			<div>
				<Helmet>
					<title>{`${this.props.config.name} - Records`}</title>
				</Helmet>
				<h2>
					Pick record ({filteredRecords.length} / {this.state.records.length})
				</h2>

				<ButtonContiner
					createRecord={this.createRecord.bind(this)}
					cleanUpInvalidRecords={this.cleanUpInvalidRecords.bind(this)}
					exportAndDownloadCSV={this.exportAndDownloadCSV.bind(this)}
					importCSV={this.importCSV.bind(this)}
					loading={this.state.loading}
				/>

				{search}
				{sort}
				<div className="list is-hoverable">{records}</div>
			</div>
		)
	}
}

export default withRouter(RecordPicker)
