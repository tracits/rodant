import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.min.css'
import './App.css'
import RecordEditor from './components/RecordEditor'
import RecordPicker from './components/RecordPicker'


/**
 * Container for the application.
 * Uses react-router to select what page to show.
 */
class App extends React.Component {
  render() {
    // Create component factories for the routes below
    let recordPicker = () => <RecordPicker db={this.props.db} codebook={this.props.codebook} />
    let recordEditor = match => <RecordEditor db={this.props.db} codebook={this.props.codebook} uid={match.match.params.uid} />
    let doubleEntry = match => <RecordEditor db={this.props.db} codebook={this.props.codebook} uid={match.match.params.uid} double-entry='true' />

    // Use React Router to select which page to show from the url
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <nav className="navbar has-background-light is-fixed-top" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item has-background-primary has-text-weight-bold is-primary">DCT</Link>
            <a role="button" className="navbar-burger burger" href="/">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div className="navbar-menu">
            <div className="navbar-start">
              <Link to="/" className="navbar-item">Records</Link>
            </div>
            <div className="navbar-end"></div>
          </div>
        </nav>
        
        <div className="container">
          <Route path="/" exact component={recordPicker} />
          <Route path="/record/:uid" component={recordEditor} />
          <Route path="/complete/:uid" component={doubleEntry} />
        </div>
      </Router>
    );
  }
}

export default App;
