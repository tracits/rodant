import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import csv from 'async-csv'
import dexie from 'dexie'

const DB_VERSION = 1
async function bootstrap() {
	// Parse codebook into javascript object
	var response = await fetch('/codebook.csv')
	var codebook = await response.text()
	var csvString = await csv.parse(codebook)
	let columns = csvString[0]
	let items = []
	for (let i = 1; i < csvString.length; i++) {
		let o = {}
		for (let j = 0; j < columns.length; j++)
			o[columns[j]] = csvString[i][j]
		items.push(o)
	}
	
	// Initialize Dexie database
	let db = new dexie('TAFT')
	let store = {
		records: '++uid,' + items.map(d => d.name).join(',')
	}
	
	db.version(DB_VERSION).stores(store)
	
	// Bootstrap the 'App'
	ReactDOM.render(<App codebook={items} db={db} />, document.getElementById('root'))
}

bootstrap()
serviceWorker.register()
