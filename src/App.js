import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Home } from "./containers/home";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { SignIn } from "./containers/signIn";
import { PrivateRoute } from "./helpers/privateRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/superadmin"
        element={
          <div className="admin-redirect">
            <h3>Super Admin Portal</h3>
            <p>This would redirect to admin portal in production</p>
            <button onClick={() => alert("Would redirect to admin in production")}>
              Simulate Redirect
            </button>
          </div>
        }
      />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;