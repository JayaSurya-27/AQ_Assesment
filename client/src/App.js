import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login.js";
import SignUp from "./components/signUp.js";
import Logout from "./components/logout.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import configData from "./config.json";
import PrivateRoute from "./utils/privateRoute";
import ApiState from "./context/apiState";
import "./css/App.css";
import "react-toastify/dist/ReactToastify.css";
import ViewProfileCandidate from "./components/viewProfileCandidate";
import { LinkedInCallback } from "react-linkedin-login-oauth2";

const App = () => {
  return (
    <>
      <GoogleOAuthProvider clientId={configData.web.client_id}>
        <Router>
          <ApiState>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/linkedin" component={LinkedInCallback} />

              {/* private Routes */}

              <Route exact path="/" element={<PrivateRoute />}>
                <Route path="/" element={<ViewProfileCandidate />} />
              </Route>

              <Route path="*" element={<h1>Not found</h1>} />
            </Routes>
          </ApiState>
        </Router>
      </GoogleOAuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        limit={2}
      />
    </>
  );
};

export default App;
