import { combineReducers } from "redux";
import { user } from "./auth/authReducer";
import { profile } from "./profile/profileReducer";
import { analysis } from "./analysis/analysisReducer";
import templatesReducer from './templates/templatesReducer'; // Default import (no curly braces)

export const reducers = combineReducers({
  user,
  profile,
  analysis,
  templates: templatesReducer // Use templatesReducer as the value for templates key
});