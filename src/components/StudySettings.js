import React, { useState, useEffect } from 'react'
import { withDB, useGet, useFind } from 'react-pouchdb'
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import FieldTypes from './FieldTypes/FieldTypes'

import './StudySettings.css'

function FieldEditor(props) {
	const { save } = props
	const [ hasChanges, setHasChanges ] = useState(false)
	let [ baseField, setBaseField ] = useState(props.field)
	let [ field, setField ] = useState(props.field)


	const fieldType = FieldTypes.find(d => d.id == field.field_type)

	const updateField = newField => {
		setField(newField)
		setHasChanges(true)
	}
	
	return <div className="field-editor">
		<div className="name">{field.name} <div className="version">(v{field.version || 0})</div></div>

		<div className="field">
			<label className="label">Name</label>
			<input 
				type="text"
				defaultValue={field.name} 
				onChange={(ev) => updateField({...field, name: ev.target.value})}
			/> 
		</div> 
		
		<div className="field">
			<label className="label">Title</label>
			<input 
				type="text"
				defaultValue={field.title} 
				onChange={(ev) => updateField({...field, title: ev.target.value})}
			/> 
		</div> 

		<div className="field">
			<label className="label">Type</label>
			<select 
				onChange={ev => updateField({...field, field_type: ev.target.value}) }
				defaultValue={field.field_type}
			>
				<option>Unselected</option>
				{ FieldTypes.map(d => <option key={d.id} value={d.id}>{d.name}</option>) }
			</select>
		</div> 

		{ fieldType != null && 
			<div className="field">
				<label className="label">{fieldType.name}</label>
				{ fieldType.editor({ field, updateField }) }
			</div>
		}

		{ hasChanges && <>
				<button onClick={() => { save(field, field => { setField(field); setBaseField({...field}); setHasChanges(false) }); }}>Save</button>
				<button onClick={() => { setField({...baseField}); setHasChanges(false) }}>Revert</button>
			</>
		}
	</div>
}

function StudySettings(props) {
	let { sid, db, history } = props
	
	const doc = useGet({ id: sid })
	const fields = useFind({
		selector: {
			type: { $eq: 'field' },
			study: { $eq: sid },
		},
	})

	const saveField = async (field, done) => {
		await db.put({...field, version: (field.version || 0) + 1})
		let updatedField = await db.get(field._id)
		done(updatedField)
	}
	
	const addField = async () => {
		try {
			await db.post({
				name: '',
				type: 'field',
				study: sid,
				version: 0,
			})
		} catch (ex) {
			console.error(ex)
		}
	}

	const deleteStudy = async () => {
		try {
			await db.remove(doc)
			history.push('/studies')
		} catch (ex) {
			console.error(ex)
		}
	}

	return <div className="container">
		<Link to={`/studies`}>Studies</Link> - <Link to={`/study/${sid}/records`}>Records</Link>
		<h1>{doc.name}</h1>		
		{sid}

		<h3>Fields</h3>
		<button onClick={() => deleteStudy()}>Delete study</button>
		<button onClick={() => addField()}>Add field</button>
		{ fields.length == 0 && <div>No fields</div>}
		{ 
			fields.length > 0 && 
			<div>
				{ fields.map(d => <FieldEditor key={d._id} field={{...d}} save={(field, done) => saveField(field, done)} />) }
			</div>
		}
	</div>
}

export default withRouter(withDB(StudySettings))