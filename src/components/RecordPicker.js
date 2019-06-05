import React from 'react'
import { Link } from 'react-router-dom';

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

	render() {
		var records = this.state.records.map(d => 
			<Link key={d.uid} to={'/record/' + d.uid}>
				{d.uid}. {d.name}
				<button onClick={e => { e.preventDefault(); this.deleteRecord(d.uid); }}>x</button>
			</Link>
		)

		return (
			<div className='content record_picker'>
				<h2>Pick record ({records.length})</h2>
				<div className='record_list'>
					{records}
				</div>
				<button onClick={() => { this.createRecord() }}>Create Record</button>
			</div>
		)
	}
}

export default RecordPicker