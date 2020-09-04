import { combineReducers } from "redux";
import Data from "./user";

const appReducer = combineReducers({
  Data,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
