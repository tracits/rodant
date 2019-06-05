import React from 'react';

function getList(str) {
	return str
		.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
		.map(d => d.replace(/"/g, ''))
}

/** 
 * Edits a Single field in a Record.
 * Render style depends on the type of Field.
 * Signals changes throught an onChanged prop callback.
 */ 
class FieldEditor extends React.Component {

	constructor(props) {
		super(props)

		this.state = { 
			record: this.props.record,
			value: this.props.record[this.props.data.name],
		}
	}
	
	async changeValueText(e) {
		if (this.props.onChange)
			this.props.onChange(this.props.data, e.target.value)

		this.setState({
			record: this.state.record,
			value: e.target.value,
		})
	}
	
	async changeValueSelect(e) {
		if (this.props.onChange)
			this.props.onChange(this.props.data, e.target.value)

		this.setState({
			record: this.state.record,
			value: e.target.value,
		})
	}

	render() {
		let d = this.props.data
		let input = null
		
		if (
			d.type === 'qualitative' && 
			d.show_valid_values === 'yes' && 
			d.valid_values !== '' && 
			d.value_labels !== ''
		) {
			// Render drop-down/select
			let values = getList(d.valid_values)
			let labels = getList(d.value_labels)
			input = <select defaultValue={this.state.value} onChange={e => this.changeValueSelect(e)}>
				<option key='default' value={d.unknown}></option>
				{values.map((d, i) => <option key={d}value={d}>{d}. {labels[i]}</option>)}
			</select>
		} else if (d.type === 'quantitative') {
			// Render number
			input = <input type="text" />
		} else {
			// Render text
			input = <input type="text" value={this.state.value} onChange={e => this.changeValueText(e)} />
		}
		
		return <div className="field" onClick={e => console.log(d)}>
			<div className="label">
				{d.label} ({d.type})
			</div>
			{input}
			<div className="description">{d.description}</div>
			<div className="coding_description">{d.coding_description}</div>
		</div>
	}
}

export default FieldEditor