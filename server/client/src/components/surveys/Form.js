// SurveyForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import FieldEntry from './FieldEntry';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class Form extends Component {
  renderFields() {
    //go through and utilize Field from redux to create the multiple inputs to be filled out
    //store into an array
    return _.map(formFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={FieldEntry}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="orange accent-2 btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function checkFields(values) {

  //have constraints on each input field
  //for all fields, some value must be entered
  //checks if emails are valid
  const errors = {};

  errors.recipients = validateEmails(values.recipients || '');

  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must make an entry';
    }
  });

  return errors;
}

export default reduxForm({
  checkFields,
  form: 'surveyForm',
  destroyOnUnmount: false
})(Form);
