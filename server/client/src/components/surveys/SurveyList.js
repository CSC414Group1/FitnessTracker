import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }

  showSurveys() {
    return this.props.surveys.reverse().map(survey => {
      return (
        <div className="card teal lighten-1" key={survey._id}>
          <div className="card-content white-text">
            <span className="card-title">{survey.title}</span>
            <p>
              Sent On: {new Date(survey.dateSent).toLocaleDateString()}
            </p>
            <p> {survey.body} </p>
          </div>
          <div className="card-action">
            <a>Clicked: {survey.yes}</a>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        {this.showSurveys()}
      </div>
    );
  }
}

function mapStateToProps({ surveys }) {
  return { surveys };
}

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);
