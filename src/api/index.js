import axios from "axios";
import { config } from "../config";
import { Helpers } from "../helpers";

const API_BASE_URL = config().API_BASE_URL;

export const ApiService = {
  signin(credentials) {
    return axios.post(`${API_BASE_URL}/api/login/`, credentials);
  },
  deleteData(body) {
    return axios.post(`${API_BASE_URL}/api/delete-data/`, body, {
      headers: {
        Authorization: `Token ${Helpers.getCookie("idToken")}`,
      },
    });
  },
  signOut() {
    return axios.post(
      `${API_BASE_URL}/api/logout/`,
      {},
      {
        headers: {
          Authorization: `Token ${Helpers.getCookie("idToken")}`,
        },
      }
    );
  },
  getProfileApi() {
    return axios.get(`${API_BASE_URL}/api/user/`, {
      headers: {
        Authorization: `Token ${Helpers.getCookie("idToken")}`,
      },
    });
  },
  changePasswordApi(body) {
    return axios.put(`${API_BASE_URL}/api/change-password/`, body, {
      headers: {
        Authorization: `Token ${Helpers.getCookie("idToken")}`,
      },
    });
  },
  evAnalysisForm(body) {
    return axios.post(`${API_BASE_URL}/api/ev-analysis/`, body, {
      timeout: 1000 * 600,
      headers: {
        Authorization: `Token ${Helpers.getCookie("idToken")}`,
      },
    });
  },
  decodeToken(token) {
    return axios.get(`${API_BASE_URL}/admin_panel/api/invitation/${token}`);
  },
};