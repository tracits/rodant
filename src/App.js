import React, { Suspense } from 'react'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { PouchDB } from 'react-pouchdb'

import 'font-awesome/css/font-awesome.min.css'
import './studies.css'

import Studies from './components/Studies'
import StudyRecords from './components/StudyRecords'
import StudySettings from './components/StudySettings'
import StudyRecord from './components/StudyRecord'

function App() {
	return <Router basename={process.env.PUBLIC_URL}>
		<Suspense fallback="loading...">
			<PouchDB name="rodant">
				<Route path="/studies" exact component={() => <Studies />} />
				<Route path="/study/:sid/records" exact component={router => <StudyRecords sid={router.match.params.sid}/>} />
				<Route path="/study/:sid/settings" exact component={router => <StudySettings sid={router.match.params.sid}/>} />
				<Route path="/study/:sid/:rid/edit" exact component={router => <StudyRecord sid={router.match.params.sid} rid={router.match.params.rid}/>} />
			</PouchDB>
		</Suspense>
	</Router>
}

export default App
