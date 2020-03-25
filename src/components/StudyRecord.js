import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { withDB, useFind, useGet } from 'react-pouchdb'
import { Link } from 'react-router-dom'

import FieldTypes from './FieldTypes/FieldTypes'

function StudyRecord(props) {
	const { sid, rid } = props

	const study = useGet({ id: sid })
	const record = useGet({ id: rid })
	const fields = useFind({ 
		selector: {
			type: { $eq: 'field' },
			study: { $eq: sid },
		}
	})


	record.fields = record.fields || {}
	const [recordState, setRecordState] = useState({})

	const valueChanged = (fieldName, newValue) => {
		console.log('valueChanged', fieldName, newValue, recordState)
		setRecordState({
			[fieldName]: {
				...recordState[fieldName],
				value: newValue,
			}
		})
	}

	const save = () => {
		console.log("save")
	}

	const hasUnsavedChanges = Object.keys(recordState).some(d => (record.fields[d] || {})._oldValue != recordState[d].value)


	return <div>
		<Link to={`/studies`}>Studies</Link> - <Link to={`/study/${sid}/settings`}>Settings</Link>
		<h1>{rid}</h1>
		{ hasUnsavedChanges && <button onClick={ev => save()}>Save</button> }
		
		{ 
			fields.map(
				field => FieldTypes.find(e => e.id == field.field_type)
					.field({ 
						field, 
						valueChanged, 
						defaultValue: (record.fields[field.name] || {}).value 
					})
			) 
		}
	</div>
}

export default withRouter(withDB(StudyRecord))