import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import reducer from "./reducers";
import Api from "./service_api";

const middlewares = [thunk.withExtraArgument(Api)];
if (process.env.NODE_ENV !== "production") {
  middlewares.push(
    createLogger({
      colors: {
        title: () => "inherit",
        prevState: () => "red",
        action: () => "#03A9F4",
        nextState: () => "#4CAF50",
        error: () => "#F20404"
      }
    })
  );
}

const store = createStore(reducer, applyMiddleware(...middlewares));

export default store;
