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
								className={isFocused ? 'field_group focused' : 'field_group' }
								key={d}

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
				<h1 className="title">Editing record: {this.state.record.uid}</h1>
				<div className='record_fields'>{fieldGroups}</div>
				{fieldHelp}
			</div>
		)
	}
}

export default RecordEditor
