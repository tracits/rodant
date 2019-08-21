import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import csv from 'async-csv'
import dexie from 'dexie'

// Start service worker
serviceWorker.register()

const DB_VERSION = 1
async function bootstrap() {
	// Parse codebook into javascript object
	var response = await fetch('/codebook.csv')
	var codebook = await response.text()
	var csvString = await csv.parse(codebook)
	var columns = csvString[0]
	var items = []
	for (var i = 1; i < csvString.length; i++) {
		var o = {}
		for (var j = 0; j < columns.length; j++)
			o[columns[j]] = csvString[i][j]
		items.push(o)
	}
	
	// Initialize Dexie database
	var db = new dexie('TAFT')
	var desc = '++uid, ' + items.map(d => d.name).join(', ')
	var store = {
		records: desc
	}
	
	db.version(DB_VERSION).stores(store)
	
	// Bootstrap the 'App'
	ReactDOM.render(<App codebook={items} db={db} />, document.getElementById('root'))

	// For prefetch of ICD data
	await import('./data/icd10.json')
}

bootstrap()
