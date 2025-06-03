import { combineReducers } from "redux";
import { user } from "./auth/authReducer";
import { profile } from "./profile/profileReducer";
import { analysis } from "./analysis/analysisReducer";

export const reducers = combineReducers({
  user,
  profile,
  analysis
});
