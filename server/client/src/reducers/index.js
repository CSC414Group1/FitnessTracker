import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import surveysReducer from './surveysReducer';

//redux allows you to break your reducers down into many different files and combine them to have more efficient organization
export default combineReducers({
  auth: authReducer,
  form: reduxForm,
  surveys: surveysReducer
});
