import React from 'react';

export function TextFieldEditor(props) {
	const { field, updateField } = props;
	return <div>
		Max length:
		<input type="number" defaultValue={field.maxLength} onChange={ev => {
			const value = parseInt(ev.target.value);
			if (!isNaN(value))
				updateField({ ...field, maxLength: parseInt(ev.target.value) });
		}} />
	</div>;
}

export function TextField(props) {
	const { field, valueChanged, defaultValue } = props
	return <div key={field.name}>
	{field.name}
	<input type="text" defaultValue={defaultValue} onChange={ev => {
		valueChanged(field.name, ev.target.value)
	}} />
	</div>
}