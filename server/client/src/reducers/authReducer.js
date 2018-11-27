import { GET_USER } from '../actions/types';

//if getting the user is the action, the payload for what to do next is returned
export default function(state = null, action) {
  switch (action.type) {
    case GET_USER:
      return action.payload || false;
    default:
      return state;
  }
}
