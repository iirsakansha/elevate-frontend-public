import { Redirect, Route } from "react-router";
import { Helpers } from ".";
export const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = Helpers.getCookie("idToken");
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    />
  );
};
