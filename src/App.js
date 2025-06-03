import { Switch, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./containers/home";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { SignIn } from "./containers/signIn"
import { PrivateRoute } from "./helpers/privateRoute";

function App() {
  return (
    <Switch>
      <Route exact path='/superadmin' component={() => {
        window.location.href = 'http://3.109.220.180/superadmin/';
        return <></>;
      }} />
      <Route exact path="/signin" component={SignIn} />
      <PrivateRoute path="/" component={Home} />
    </Switch>
  );
}

export default App;
