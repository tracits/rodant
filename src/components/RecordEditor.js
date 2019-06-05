import React from 'react';
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

		// Create FieldEditors
		var fields = this.props.codebook
			.filter(d => d.visible === 'yes')
			.map(d => 
				<FieldEditor 
					key={d.name} 
					data={d} 
					record={this.state.record} 
					onChange={(f, v) => this.onChange(f, v)} 
				/>
			)

		return (
			<div className='content'>
				<h2>Editing record: {this.state.record.uid}</h2>
				<div className='record_fields'>{fields}</div>
			</div>
		)
	}
}

export default RecordEditor