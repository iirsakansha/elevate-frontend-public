import {
  GET_TEMPLATES_REQUEST,
  GET_TEMPLATES_SUCCESS,
  GET_TEMPLATES_FAILURE,
  CREATE_TEMPLATE_REQUEST,
  CREATE_TEMPLATE_SUCCESS,
  CREATE_TEMPLATE_FAILURE,
  UPDATE_TEMPLATE_REQUEST,
  UPDATE_TEMPLATE_SUCCESS,
  UPDATE_TEMPLATE_FAILURE,
  DELETE_TEMPLATE_REQUEST,
  DELETE_TEMPLATE_SUCCESS,
  DELETE_TEMPLATE_FAILURE,
} from './templatesActionConstant';

// Action Creators
export const getTemplatesAction = () => {
  return (dispatch) => {
    dispatch({ type: GET_TEMPLATES_REQUEST });
    try {
      // Simulate API call or return predefined templates
      // For now, we'll dispatch success with an empty array since templates are handled locally
      dispatch({ type: GET_TEMPLATES_SUCCESS, payload: [] });
    } catch (error) {
      dispatch({ type: GET_TEMPLATES_FAILURE, payload: error.message });
    }
  };
};

export const createTemplateAction = (templateData, callback) => {
  return (dispatch) => {
    dispatch({ type: CREATE_TEMPLATE_REQUEST });
    try {
      // Simulate API call to create template
      dispatch({ type: CREATE_TEMPLATE_SUCCESS, payload: templateData });
      if (callback) callback();
    } catch (error) {
      dispatch({ type: CREATE_TEMPLATE_FAILURE, payload: error.message });
    }
  };
};

export const updateTemplateAction = (id, templateData, callback) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_TEMPLATE_REQUEST });
    try {
      // Simulate API call to update template
      dispatch({ type: UPDATE_TEMPLATE_SUCCESS, payload: { ...templateData, id } });
      if (callback) callback();
    } catch (error) {
      dispatch({ type: UPDATE_TEMPLATE_FAILURE, payload: error.message });
    }
  };
};

export const deleteTemplateAction = (id, callback) => {
  return (dispatch) => {
    dispatch({ type: DELETE_TEMPLATE_REQUEST });
    try {
      // Simulate API call to delete template
      dispatch({ type: DELETE_TEMPLATE_SUCCESS, payload: id });
      if (callback) callback();
    } catch (error) {
      dispatch({ type: DELETE_TEMPLATE_FAILURE, payload: error.message });
    }
  };
};

// Reducer
const initialState = {
  templates: [],
  loading: false,
  error: null,
};

const templatesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEMPLATES_REQUEST:
    case CREATE_TEMPLATE_REQUEST:
    case UPDATE_TEMPLATE_REQUEST:
    case DELETE_TEMPLATE_REQUEST:
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

    case CREATE_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        templates: [...state.templates, action.payload],
        error: null,
      };

    case UPDATE_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        templates: state.templates.map(template =>
          template.id === action.payload.id ? action.payload : template
        ),
        error: null,
      };

    case DELETE_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        templates: state.templates.filter(template => template.id !== action.payload),
        error: null,
      };

    case GET_TEMPLATES_FAILURE:
    case CREATE_TEMPLATE_FAILURE:
    case UPDATE_TEMPLATE_FAILURE:
    case DELETE_TEMPLATE_FAILURE:
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