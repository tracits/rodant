import React from 'react'
import _ from 'lodash'
import FieldEditor from './FieldEditor'
import { validateRecord } from '../functions/validation'

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
		
		let cbo = {}
		for (let i = 0; i < props.codebook.length; i++)
			cbo[props.codebook[i].name] = props.codebook[i]
		
		console.log(cbo)

		this.state = {
			state: RecordEditorState.NONE,
			record: null,
			allowRadios: false,
		}
	}

	async componentDidMount() {
		this.setState({ 
			state: RecordEditorState.LOADING,
			record: null,
		})

		let record = await this.props.db.records
			.where('uid').equals(Number(this.props.uid))
			.first()

		this.setState({
			state: !record ? RecordEditorState.NOTFOUND : RecordEditorState.READY,
			record: record,
		})
	}
	
	// Persists changes to databases
	async onChange(field, value) {
		let record = { ...this.state.record }
		record[field.name] = value
		this.setState({
			record: record
		})
		
		let modify = {}
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
		let record = { ...this.state.record }
		for (let c of this.props.codebook) {
			if (record[c.name] === undefined || record[c.name] === '') {
				record[c.name] = c.unknown || '999'
				this.onChange(c, c.unknown || '999')
			}
		}

		this.setState({
			state: this.state.state,
			record: record,
			focusedField: null,
		})
	}

	validateFieldGroup(group, validation) {
		if (group.some(d => d.input !== 'yes'))
			return 'valid'

		if (group.some(d => validation[d.name].unknown))
			return 'unknown'
		
		if (group.some(d => validation[d.name].incomplete))
			return 'incomplete'

		if (group.some(d => !validation[d.name].valid))
			return 'invalid'

		return 'valid'
	}

	render() {
		// Handle loading and errors
		if (this.state.state === RecordEditorState.LOADING)
			return <div className='content'>Loading...</div>
		else if (this.state.state === RecordEditorState.NOTFOUND)
			return <div className='content'>Couldn't find record with id: {this.props.uid}</div>
		else if (this.state.state === RecordEditorState.NONE)
			return <div className='content'>Idle</div>
		
		// Populate fields from codebook
		let fields = {}
		for (let field of this.props.codebook)
			fields[field.name] = field
	
		// Do validation
		let validation = validateRecord(this.state.record, this.props.codebook)

		// Group fields using 'group1' 
		let groups = _.groupBy(this.props.codebook.filter(d => d.visible === 'yes'), 'group1')
	
		// Create field groups
		let fieldGroups = Object.keys(groups)
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
										allowRadios={this.state.allowRadios}
										validation={validation[d.name]}
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
										this.validateFieldGroup(fieldGroups[d], validation),
									]
										.filter(Boolean).join(' ')
								}
								key={d}
								onClick={() => {
									this.validateFieldGroup(fieldGroups[d], validation)
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
				
				<div className="errors">
					{
						validation[this.state.focusedField.props.data.name].errors.map((d, i) => 
							<div className="error" key={i}>{d}</div>
						)
					}
				</div>
				
				<div className="warnings">
					{
						validation[this.state.focusedField.props.data.name].warnings.map((d, i) => 
							<div className="warning" key={i}>{d}</div>
						)
					}
				</div>
				
				<div className="description">
					{this.state.focusedField.props.data.description}
					{
						this.state.focusedField.props.data.show_valid_values === 'yes' ? 
							<div className="valid_values">{this.formatValid(this.state.focusedField.props.data)}</div> :
							null
					}
				</div>
				<div className="coding_description">{this.state.focusedField.props.data.coding_description}</div>
			</div>
		)

		return (
			<div className='content'>
				<h1 className='title'>Editing record: {this.state.record.uid}</h1>
				<div className='toolbar'>
					<button className="button is-rounded" onClick={() => { this.markFieldsUnknown() }}>Mark empty fields as Not Known</button>
					<div className="control">
						<label className="checkbox">
							<input 
								type="checkbox" 
								value={this.props.allowRadios} 
								onChange={e => this.changeRadios(e)}
							/> [debug] Enable radio buttons
						</label>
					</div>
				</div>
				
				<div className='record_fields'>{fieldGroups}</div>
				{fieldHelp}
			</div>
		)
	}

	changeRadios(e) {
		this.setState({
			allowRadios: !this.state.allowRadios,
		})
	}

	formatValid(data) {
		if (data.type === 'quantitative')
			return 'Range: ' + data.valid_values.split(',').join(' .. ')

		return ''
	}
}

export default RecordEditor
