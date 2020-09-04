import { USER, PREVPATH, BOOK, LOGIN_SUCCESS } from "../actions/types";

const initialState = {
  userData: null,
  user: null,
  book: null,
  prevPath: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        userData: action.userData,
      };
    case USER:
      return {
        ...state,
        user: action.user,
      };
    case BOOK:
      return {
        ...state,
        book: action.Book,
      };
    case PREVPATH:
      return {
        ...state,
        prevPath: action.path,
      };
    default:
      return state;
  }
}
