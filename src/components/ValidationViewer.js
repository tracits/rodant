import React from 'react'
import _ from 'lodash'
import { isUnknown } from '../functions/validation'

const ValidationViewer = props => {
	const fields = Object.keys(props.validation)
		.filter(
			d =>
				props.record[d] &&
				(!props.validation[d].valid ||
					props.validation[d].warnings.length > 0) &&
				!props.validation[d].unknown &&
				!isUnknown(props.validation[d].value, d)
		)
		.map(d => ({
			...props.validation[d],
			name: d,
			field: props.codebook.find(e => e.name === d),
		}))

	const groups = _.groupBy(fields, 'field.group1')

	let ui = Object.keys(groups).map(g => (
		<div key={g} className="group">
			<div className="group-name">{g}</div>
			{groups[g].map(d => (
				<div key={d.name} className="field">
					<div className="field-name">{d.field.label}</div>
					{props.validation[d.name].errors.map((e, i) => (
						<div className="issue error" key={`error ${i}`}>
							<span className="fa fa-bug" />
							<div className="description">{e}</div>
						</div>
					))}
					{props.validation[d.name].warnings.map((e, i) => (
						<div className="issue warning" key={`warning ${i}`}>
							<span className="fa fa-warning" />
							<div className="description">{e}</div>
						</div>
					))}
				</div>
			))}
		</div>
	))

	return <div className="validation-container">{ui}</div>
}

export default ValidationViewer
