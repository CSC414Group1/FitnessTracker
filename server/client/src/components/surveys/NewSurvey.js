// SurveyNew shows SurveyForm and SurveyFormReview
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import Form from './Form';
import FormReview from './FormReview';

class NewSurvey extends Component {
  constructor(props) {
    super(props)
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
