import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { reducers } from ".";

export const configureStore = () => {
  const store = createStore(reducers, applyMiddleware(logger, thunk));
  return store;
};
