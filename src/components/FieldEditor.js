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
			value: (this.props.record[this.props.data.name] || '').toString(),
			showDescriptions: false,
		}
	}

	componentDidUpdate(prevProps) {
		// Update 
		let desiredValue = (this.props.record[this.props.data.name] || '').toString()

		if (
			this.state.value !== desiredValue &&
			this.state.value === ''
		)
			this.setState({
				value: desiredValue,
			})
	}

	async changeValueText(e) {
		if (this.props.onChange)
			this.props.onChange(this.props.data, e.target.value)
		
		this.setState({
			value: e.target.value,
		})
	}
	
	async changeValueSelect(e) {
		if (this.props.onChange)
			this.props.onChange(this.props.data, e.target.value)
		
		this.setState({
			value: e.target.value,
		})
	}

 	toggleDescriptions(e) {
		this.setState({
			showDescriptions: !this.state.showDescriptions,
		})
	}

	getFieldClass() {
		if (this.state.value === this.props.data.unknown)
			return "default_value"

		return "valid"
	}

	onFocus() {
		if (this.props.onFocus)
			this.props.onFocus(this)
	}

	onBlur() {
		if (this.props.onBlur)
			this.props.onBlur(this)
	}

	render() {
		let d = this.props.data
		let input = null
		let unlabeled = this.props.unlabeled === true
		
		let label = unlabeled ? null : (
			<label className="label">
				{d.label}
			</label>
		)

		if (
			d.type === 'qualitative' && 
			d.show_valid_values === 'yes' && 
			d.valid_values !== '' && 
			d.value_labels !== ''
		) {
			// Render drop-down/select
			let values = getList(d.valid_values)
			let labels = getList(d.value_labels)
			input = <div className="select is-small is-light">
				<select 
					value={this.state.value} 
					onChange={e => this.changeValueSelect(e)}
					onFocus={e => this.onFocus()}
					onBlur={e => this.onBlur()}
				>
					<option key='unset'></option>
					{values.map((d, i) => <option key={d} value={d}>{d}. {labels[i]}</option>)}
					{
						d.unknown !== '' &&
							<option key='unknown' value={d.unknown}>{d.unknown}. Unknown</option>
					}
				</select>
			</div>
		} else if (d.type === 'quantitative') {
			// Render number
			input = <input 
				className="input is-small"
				type="text" 
				placeholder={unlabeled ? d.label : ''} 
				value={this.state.value}
				onChange={e => this.changeValueText(e)} 
				onFocus={e => this.onFocus()}
				onBlur={e => this.onBlur()}
			/>
		} else {
			// Render text
			input = <input
				className="input is-small"
				type="text"
				placeholder={unlabeled ? d.label : ''}
				value={this.state.value}
				onChange={e => this.changeValueText(e)} 
				onFocus={e => this.onFocus()}
				onBlur={e => this.onBlur()}				
			/>
		}

		let helpButton = this.props.showHelp === true ? <button className="button is-small" onClick={() => this.toggleDescriptions()}><span className="fa fa-question" /></button> : null 
		
		return <div className={'record_field ' + this.getFieldClass() } onClick={e => console.log(d)}>
			{label}
			<div className="field has-addons">
				<div className="control">{input}</div>
				{helpButton}		
			</div>

			<div className={this.state.showDescriptions ? 'descriptions show' : 'descriptions' }>
				<div className="description">{d.description}</div>
				<div className="coding_description">{d.coding_description}</div>
			</div>
		</div>
	}
}

export default FieldEditor
