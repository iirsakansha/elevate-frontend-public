import { AnalysisActionTypes } from "./analysisActionConstant";

const initState = {
  isanalysisLoading: false,
  isanalysisError: null,
  analysisResult: null,
};

export const analysis = (state = initState, action) => {
  switch (action.type) {
    case AnalysisActionTypes.ANALYSIS_LOADING:
      return {
        ...state,
        isanalysisLoading: true,
        isanalysisError: null,
      };
    case AnalysisActionTypes.ANALYSIS_SUCCESS:
      return {
        ...state,
        isanalysisLoading: false,
        isanalysisError: null,
        analysisResult: action.analysis,
      };
    case AnalysisActionTypes.ANALYSIS_FAILED:
      return {
        ...state,
        isanalysisLoading: false,
        isanalysisError: action.err,
      };
    default:
      return state;
  }
};
