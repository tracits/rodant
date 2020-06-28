# Rodant
[![Automated Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)](https://github-tools.github.io/github-release-notes/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A simple and open source web application for collection of research data**

Rodant (intentionally spelled like this, as a combination of rodent and ant, the gatherer and organizer) aims to be a lightweight offline first browser app that simplifies data collection for research across settings. The primary focus is low resource settings with poor or patchy connectivity but being built to work in those settings make it attractive everywhere. 
Rodant aims to be easy to setup and without external dependencies (except the browser it runs in). It is easy to deploy and customize. Its behavior is governed by two files:

### 1. [`config.json`](public/config.json)


### 2. [`codebook.csv`](public/codebook.csv)
**We hope to migrate to a json version of this soon**


## Usage
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Installation

Clone this repository:  

`git clone https://github.com/tracits/cockroach_react.git`

### Available Scripts

In the project directory, run:  

`npm install`  

You can then run:  

`npm start`  

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.  

The page will reload if you make edits.  
You will also see any lint errors in the console.  

`npm test`  

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.  

`npm run build`  

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.  

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!  

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### Build for when hosting in subdirectory
Set the environment variable PUBLIC_URL before building  
Unix-like: PUBLIC_URL=/THE_URL_TO_HOST_AT/ npm run build  
Windows: cmd /V /C "set PUBLIC_URL=/THE_URL_TO_HOST_AT/&& npm run build"  
