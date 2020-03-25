import React from 'react'
import { withDB, useGet, useFind } from 'react-pouchdb'
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

function StudyRecords(props) {
	let { sid, db } = props
	const study = useGet({ id: sid })
	const records = useFind({
		selector: {
			type: { $eq: 'record' },
			study: { $eq: sid },
		}
	})

	const createRecord = async () => {
		try {
			await db.post({
				type: 'record',
				study: sid,
				version: 0,
			})
		} catch (ex) {
			console.error(ex)
		}
	}

	return <div>
		<Link to={`/studies`}>Studies</Link> - <Link to={`/study/${sid}/settings`}>Settings</Link>
		<h1>{study.name}</h1>
		<button onClick={() => createRecord()}>Create record</button>
		{ records.length == 0 && (
			<div>No records</div>
		)}

		{ records.length > 0 && 
			records.map(d => (
				<div key={d._id}>
					<Link to={`/study/${sid}/${d._id}/edit`}>{d._id}</Link>
				</div>
			))
		}
	</div>
}

export default withRouter(withDB(StudyRecords))