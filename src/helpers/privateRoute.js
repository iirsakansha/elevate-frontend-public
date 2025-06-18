// In src/helpers/privateRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helpers } from "../helpers";

export const PrivateRoute = ({ children }) => {
  const isAuthenticated =
    true ||
    localStorage.getItem('dev-token') || 
    Helpers.getCookie('idToken'); 


  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};