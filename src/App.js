// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Home } from "./containers/home";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { SignIn } from "./containers/signIn";
import { PrivateRoute } from "./helpers/privateRoute";

function App() {
  return (
    <Routes>
      <Route path="/signin/:token?" element={<SignIn />} /> {/* Optional token param */}
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