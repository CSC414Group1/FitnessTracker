import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Home from './Home';
import LoginHome from './LoginHome';
import NewSurvey from './surveys/NewSurvey';
import FitnessSurvey from './surveys/FitnessSurvey';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            <Route exact path="/" component={Home} />
            <Route exact path="/loginhome" component={LoginHome} />
            <Route path="/surveys/new" component={NewSurvey} />
            <Route exact path="/fitnessSurvey" component={FitnessSurvey} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);
