import { notification } from "antd";
import { ApiService } from "../../api";
import { ProfileActionTypes } from "./profileActionConstant";

export const getProfile = () => {
  return async (dispatch) => {
    dispatch({ type: ProfileActionTypes.PROFILE_LOADING });
    try {
      const response = await ApiService.getProfileApi();
      dispatch({ type: ProfileActionTypes.PROFILE_SUCCESS,profile: response.data });
    } catch (err) {
      notification.error({
        message: "Failed to Get Profile",
        placement: "bottomRight"
      })
      dispatch({
        type: ProfileActionTypes.PROFILE_FAILED,
        err: err.response?.data?.non_field_errors?.[0] || err.message,
      });
    }
  };
};
