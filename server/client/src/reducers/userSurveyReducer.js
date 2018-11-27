import { GET_USERSURVEY } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case GET_USERSURVEY:
      return action.payload;
    default:
      return state;
  }
}
