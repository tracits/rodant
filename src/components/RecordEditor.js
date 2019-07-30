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
		var record = { ...this.state.record }
		record[field.name] = value
		this.setState({
			record: record
		})
		
		var modify = {}
		modify[field.name] = value
		
		await this.props.db.records
			.where('uid').equals(Number(this.props.uid))
			.modify(modify)
	}

	onFocusFieldEditor(fe) {
		this.setState({
			state: this.state.state,
			record: this.state.record,
			focusedField: fe,
		})
	}

	onBlurFieldEditor(fe) {
		this.setState({
			state: this.state.state,
			record: this.state.record,
			focusedField: null,
		})
	}

	markFieldsUnknown() {
		var record = { ...this.state.record }
		for (let c of this.props.codebook) {
			if (record[c.name] === undefined) {
				record[c.name] = c.unknown
				this.onChange(c, c.unknown)
			}
		}

		this.setState({
			state: this.state.state,
			record: record,
			focusedField: null,
		})
	}

	validateField(field) {
		var value = this.state.record[field.name] || ''
		if (value === '')
			return 'incomplete'

		if (value === field.unknown)
			return 'unknown'
		
		// TODO: Implement actual validation
		return 'valid'
	}

	validateFieldGroup(group) {
		let fields = group.map(field => this.validateField(field))
		
		if (fields.every(d => d === 'valid'))
			return 'valid'

		if (fields.some(d => d === 'incomplete'))
			return 'incomplete'

		if (fields.some(d => d === 'unknown'))
			return 'unknown'
		
		if (fields.some(d => d === 'invalid'))
			return 'invalid'
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
					let fieldGroups = _.groupBy(groups[k], d => d.group2 === '' ? '_' + ++i : d.group2) // HACK: Create unique id(_#) for fields with empty group2 so they are not all grouped together
					let fieldGroupElements = Object.keys(fieldGroups)
						.map(d => {
							let label = d[0] === '_' ? null : <div className="label">{d}</div>
							let fields = fieldGroups[d]
								.map(d =>
									<FieldEditor
										key={d.name}
										data={d}
										record={this.state.record}
										unlabeled={d.group2 !== ''}
										onChange={(f, v) => this.onChange(f, v)}
										onFocus={fe => this.onFocusFieldEditor(fe)}
										onBlur={fe => this.onBlurFieldEditor(fe)}
									/>
								)
							
							let isFocused = this.state.focusedField != null && 
								fieldGroups[d].find(d => d.name === this.state.focusedField.props.data.name) != null

							return <div 
								className={
									[
										'field_group',
										isFocused ? 'focused' : null,
										this.validateFieldGroup(fieldGroups[d]),
									]
										.filter(Boolean).join(' ')
								}
								key={d}
								onClick={() => {
									this.validateFieldGroup(fieldGroups[d])
								}}
							>
								{label}
								{fields}
							</div>
						})

					return <div className="record_group" key={k}>
						<h2 className="title">
							{k}
						</h2>
						<div className="fields">
							{fieldGroupElements}
						</div>
					</div>
				})
			
		let fieldHelp = !this.state.focusedField ? <div className='field_help'></div> : (
			<div className='field_help visible'>
				<div className="label">{this.state.focusedField.props.data.label}</div>
				<div className="description">{this.state.focusedField.props.data.description}</div>
				<div className="coding_description">{this.state.focusedField.props.data.coding_description}</div>
			</div>
		)

		return (
			<div className='content'>
				<h1 className='title'>Editing record: {this.state.record.uid}</h1>
				<div className='toolbar'>
					<button className="button is-rounded" onClick={() => { this.markFieldsUnknown() }}>Mark empty fields as Not Known</button>
				</div>
				<div className='record_fields'>{fieldGroups}</div>
				{fieldHelp}
			</div>
		)
	}
}

export default RecordEditor
