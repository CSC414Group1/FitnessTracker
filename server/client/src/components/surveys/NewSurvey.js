// SurveyNew shows SurveyForm and SurveyFormReview
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import Form from './Form';
import FormReview from './FormReview';

class NewSurvey extends Component {
  constructor(props) {
    super(props)
    //don't want to always show the review of the survey
    //only once have clicked the review button and filled out all the form fields
    this.state = { showFormReview: false };

  }

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <FormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }

    //if not reviewing the form, show the original email form to fill out
    return (
      <Form
        onSurveySubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }

  render() {
    return (
      <div>
        {this.renderContent()}
      </div>
    );
  }
}

export default reduxForm({
  form: 'surveyForm'
})(NewSurvey);
