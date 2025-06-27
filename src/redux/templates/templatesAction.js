import { message } from 'antd';
import {
  GET_TEMPLATES_REQUEST,
  GET_TEMPLATES_SUCCESS,
  GET_TEMPLATES_FAILURE,
} from './templatesActionConstant';
import { ApiService } from '../../api/index';

export const getTemplatesAction = () => async (dispatch) => {
  dispatch({ type: GET_TEMPLATES_REQUEST });
  try {
    const response = await ApiService.getTemplates();
    dispatch({ type: GET_TEMPLATES_SUCCESS, payload: response.data });
  } catch (error) {
    console.error('Full error:', error); // Log full error
    console.error('Response:', error.response); // Log response if exists
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'Failed to fetch templates';
    dispatch({ type: GET_TEMPLATES_FAILURE, payload: errorMessage });
    message.error(errorMessage);
  }
};