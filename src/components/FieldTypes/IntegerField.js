import React from 'react'

export function IntegerFieldEditor(props) {
	let { field, updateField } = props
	return <div>
		Min: <input type="number" value={field.min} onChange={ev => {
			const value = parseInt(ev.target.value)
			if (!isNaN(value)) {
				updateField({ ...field, min: value })
			}
		}} />
		Max: <input type="number" value={field.max} onChange={ev => {
			const value = parseInt(ev.target.value)
			if (!isNaN(value)) {
				updateField({ ...field, max: value })
			}
		}} />
	</div>
}

export function IntegerField(props) {
	return <div>IntegerField</div>
}
