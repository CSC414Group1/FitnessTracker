import axios from 'axios';
import { GET_USER, GET_SURVEYS, GET_USERSURVEY } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: GET_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async dispatch => {
  console.log("value" , values)
  const res = await axios.post('/api/surveys', values);

  history.push('/loginhome');
  dispatch({ type: GET_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');
  dispatch({ type: GET_SURVEYS, payload: res.data });
};

export const sumbitUserSurvey = (data) => async dispatch => {
  const res = await axios.post('/surveyPost', data);
  dispatch({ type: GET_USERSURVEY, payload: res.data });
}
