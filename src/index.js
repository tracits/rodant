import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import parser from 'csv-parse'
import dexie from 'dexie'

const DB_VERSION = 1

// Parse codebook into javascript object
fetch('/codebook.csv')
	.then(d => {
		d.text()
			.then(e => {
				parser(e, {}, (err, output) => {
					let columns = output[0]
					let items = []
					for (let i = 1; i < output.length; i++) {
						let o = {}
						for (let j = 0; j < columns.length; j++)
							o[columns[j]] = output[i][j]
						items.push(o)
					}

					// Initialize Dexie database
					let db = new dexie('TAFT')
					let store = {
						records: '++uid,' + items.map(d => d.name).join(',')
					}
				
					db.version(DB_VERSION).stores(store)
					
					// Bootstrap the 'App'
					ReactDOM.render(<App codebook={items} db={db}/>, document.getElementById('root'))
				})
			})
	})


serviceWorker.register();
