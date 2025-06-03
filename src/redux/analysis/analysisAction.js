import { ApiService } from "../../api";
import { AnalysisActionTypes } from "./analysisActionConstant";

export const getAnalysisResult = (data, cb) => {
  return async (dispatch) => {
    dispatch({ type: AnalysisActionTypes.ANALYSIS_LOADING });
    try {
      const response = await ApiService.evAnalysisForm(data);
      dispatch({
        type: AnalysisActionTypes.ANALYSIS_SUCCESS,
        analysis: response.data,
      });
      cb();
    } catch (err) {
      dispatch({
        type: AnalysisActionTypes.ANALYSIS_FAILED,
        err:
          err.response?.data?.non_field_errors?.[0] ||
          err.message ||
          "Failed to Get Analysis Result",
      });
    }
  };
};
export const deleteAnlysisResult = (data) => {
  return async (dispatch) => {
    try {
      const response = await ApiService.deleteData(data);
    } catch (err) {

    }
  };
};

