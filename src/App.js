import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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
    var recordPicker = () => <RecordPicker db={this.props.db} />
    var recordEditor = match => <RecordEditor db={this.props.db} codebook={this.props.codebook} uid={match.match.params.uid} />

    // Use React Router to select which page to show from the url
    return (
      <Router>
        <div className="App">
          <div className="toolbar">
            <Link to="/">Records</Link>
          </div>
          
          <Route path="/" exact component={recordPicker} />
          <Route path="/record/:uid" component={recordEditor} />
        </div>
      </Router>
    );
  }
}

export default App;
