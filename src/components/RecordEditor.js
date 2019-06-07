import React from 'react'
import _ from 'lodash'
import FieldEditor from './FieldEditor'


const RecordEditorState = {
	NONE: 0,
	LOADING: 1,
	NOTFOUND: 2,
	READY: 3,
}

/**
 * Editor for a set of fields in the supplied Record.
 * Listens for changes through the FieldEditor's onChange prop
 * and persists all changes directly to database.
 */
class RecordEditor extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			state: RecordEditorState.NONE,
			record: null,
		}
	}

	async componentDidMount() {
		this.setState({ 
			state: RecordEditorState.LOADING,
			record: null,
		})

		var record = await this.props.db.records
			.where('uid').equals(Number(this.props.uid))
			.first()

		this.setState({
			state: !record ? RecordEditorState.NOTFOUND : RecordEditorState.READY,
			record: record,
		})
	}
	
	// Persists changes to databases
	async onChange(field, value) {
		var modify = {}
		modify[field.name] = value

		await this.props.db.records
			.where('uid').equals(Number(this.props.uid))
			.modify(modify)
	}

	render() {
		// Handle loading and errors
		if (this.state.state === RecordEditorState.LOADING)
			return <div className='content'>Loading...</div>
		else if (this.state.state === RecordEditorState.NOTFOUND)
			return <div className='content'>Couldn't find record with id: {this.props.uid}</div>
		else if (this.state.state === RecordEditorState.NONE)
			return <div className='content'>Idle</div>

			
		// Group fields using 'group1' 
		var groups = _.groupBy(this.props.codebook.filter(d => d.visible === 'yes'), 'group1')
	
		// Create field groups
		var fieldGroups = Object.keys(groups)
			.map(
				k => {
					let i = 0
					// Group fields in group using 'group2'
					// This level is to group things like connected Dates and Times, or Free Text and ICD-10 codes
					let fieldGroups = _.groupBy(groups[k], d => d.group2 == '' ? '_' + ++i : d.group2) // HACK: Create unique id(_#) for fields with empty group2 so they are not all grouped together

					let fieldGroupElements = Object.keys(fieldGroups)
						.map(d => {
							let label = d[0] == '_' ? null : <div className="label">{d}</div>
							let fields = fieldGroups[d]
								.map(d =>
									<FieldEditor
										key={d.name}
										data={d}
										record={this.state.record}
										unlabeled={d.group2 !== ''}
										onChange={(f, v) => this.onChange(f, v)}
									/>
								)
							
							return <div className="field_group" key={d}>
								{label}
								{fields}
							</div>
						})


					return <div className="record_group" key={k}>
						<div className="record_group_title">
							{k}
						</div>
						<div className="fields">
							{fieldGroupElements}
						</div>
					</div>
				})
			

		return (
			<div className='content'>
				<h2>Editing record: {this.state.record.uid}</h2>
				<div className='record_fields'>{fieldGroups}</div>
			</div>
		)
	}
}

export default RecordEditor