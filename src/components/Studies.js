import React, { useState, useEffect } from 'react'
import { withDB, useFind } from 'react-pouchdb'
import { Link } from 'react-router-dom'

function Studies(props) {
	const db = props.db
	let [createName, setCreateName] = useState('')

	const studies = useFind({
		selector: {
			type: { $eq: 'study'},
		},
	})

	const createStudy = async () => {
		try {
			await db.post({
				name: createName,
				type: 'study',
				create_date: new Date(),
				fields: {},
			})
		} catch (ex) {
			console.log(ex)
		}
	}

	return <div className="container">
		<h2>Studies</h2>
		{ studies.length == 0 && <div>No studies</div>}
		{ studies.length > 0 && 
			<div className="studies-list">
				{ 
					studies.map(
						d => <div key={d._id}>
							<Link to={`/study/${d._id}/records`}>{d.name}</Link>
						</div>) 
				}
			</div>
		}
		<input type="text" onChange={ev => setCreateName(ev.target.value)} />
		<button onClick={() => createStudy()}>Create study</button>
	</div>
}

export default withDB(Studies)