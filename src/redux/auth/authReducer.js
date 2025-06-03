import { AuthActionTypes } from "./authActionConstant";

const initState = {
  isSigninLoading: false,
  isSigninError: null,
  isChangePasswordLoading: false,
  isChangePasswordError: null,
};

export const user = (state = initState, action) => {
  switch (action.type) {
    case AuthActionTypes.SIGN_IN_LOADING:
      return {
        ...state,
        isSigninLoading: true,
        isSigninError: null,
      };
    case AuthActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        isSigninLoading: false,
        isSigninError: null,
      };
    case AuthActionTypes.SIGN_IN_FAILED:
      return {
        ...state,
        isSigninLoading: false,
        isSigninError: action.err,
      };
    case AuthActionTypes.CHANGE_PASSWORD_LOADING:
      return {
        ...state,
        isChangePasswordLoading: true,
        isChangePasswordError: null,
      };
    case AuthActionTypes.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        isChangePasswordLoading: false,
        isChangePasswordError: null,
      };
    case AuthActionTypes.CHANGE_PASSWORD_FAILED:
      return {
        ...state,
        isChangePasswordLoading: false,
        isChangePasswordError: action.err,
      };
    default:
      return state;
  }
};
