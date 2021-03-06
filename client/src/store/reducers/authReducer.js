import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE
} from "../actions/types";

export default function(state = {}, action) {
  console.log(action);
  switch (action.type) {
    case AUTH_USER:
      return { ...state, authenticated: true, error: "", user: action.payload };
    case UNAUTH_USER:
      return { ...state, authenticated: false, user: null };
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    case FETCH_MESSAGE:
      return { ...state, message: action.payload };
    default:
      return state;
  }
}
