// src/redux/templates/templatesReducer.js
import {
  GET_TEMPLATES_REQUEST,
  GET_TEMPLATES_SUCCESS,
  GET_TEMPLATES_FAILURE,
} from './templatesActionConstant';

const initialState = {
  templates: [],
  loading: false,
  error: null,
};

const templatesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEMPLATES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_TEMPLATES_SUCCESS:
      return {
        ...state,
        loading: false,
        templates: action.payload,
        error: null,
      };
    case GET_TEMPLATES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default templatesReducer;