import { notification } from "antd";
import { ApiService } from "../../api";
import { Helpers } from "../../helpers";
import { deleteAnlysisResult } from "../analysis/analysisAction";
import { AuthActionTypes } from "./authActionConstant";

export const signInAction = (cradentials, cb) => {
  return async (dispatch) => {
    dispatch({ type: AuthActionTypes.SIGN_IN_LOADING });
    try {
      const response = await ApiService.signin(cradentials);
      Helpers.setCookie("idToken", response.data.token, 5 / 12);
      cb();
      dispatch({ type: AuthActionTypes.SIGN_IN_SUCCESS });
    } catch (err) {
      dispatch({
        type: AuthActionTypes.SIGN_IN_FAILED,
        err: err.response?.data?.non_field_errors || "",
      });
    }
  };
};

export const changePassword = (password) => {
  return async (dispatch) => {
    dispatch({ type: AuthActionTypes.CHANGE_PASSWORD_LOADING });
    try {
      await ApiService.changePasswordApi(password);
      dispatch({ type: AuthActionTypes.CHANGE_PASSWORD_SUCCESS });
      notification.success({
        message: <span style={{ color: "green" }}>Change Password Successfully</span>,
        placement: "bottomRight",
        style: { color: "green" },
      });
    } catch (err) {
      dispatch({
        type: AuthActionTypes.CHANGE_PASSWORD_FAILED,
        err:
          err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.err ||
          err.message,
      });
    }
  };
};
export const signOutAction = (cb) => {
  return async (dispatch, getState) => {
    dispatch({ type: AuthActionTypes.SIGN_IN_LOADING });
    try {
      const response = await ApiService.signOut();
      if (+response.status === 204) {
        Helpers.deleteAllCookies();
        cb();
      }
      dispatch({ type: AuthActionTypes.SIGN_IN_SUCCESS });
    } catch (err) {
      console.log(err.response);
      // dispatch({ type: AuthActionTypes.SIGN_IN_FAILED, err: err.message });
    }
  };
};
