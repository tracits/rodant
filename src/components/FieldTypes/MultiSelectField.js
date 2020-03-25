import React from 'react'

export function MultiSelectFieldEditor(props) {
	const { field, updateField } = props;
	field.options = (field.options || []).map(d => ({ ...d }));
	const addOption = () => updateField({ ...field, options: [...field.options, { id: 0, name: 'unnamed' }] });
	return <div>
		<button onClick={() => addOption()}>Add option</button>
		{field.options.length == 0 && <div>No options</div>}
		{field.options.map((d, i) => <div key={i}>
			id: <input type="text" value={d.id} onChange={ev => {
				field.options[i] = { ...field.options[i], id: ev.target.value };
				updateField({ ...field });
			}} />
				&nbsp;&nbsp;name: <input type="text" value={d.name} onChange={ev => {
				field.options[i] = { ...field.options[i], name: ev.target.value };
				updateField({ ...field });
			}} />
		</div>)}
	</div>;
}

export function MultiSelectField(props) {
	return <div>MultiSelectField</div>
}