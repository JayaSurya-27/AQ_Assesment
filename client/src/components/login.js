import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import ApiContext from "../context/apiContext";
import "./../css/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const context = useContext(ApiContext);
  const {
    loginStatus,
    authTokens,
    login,
    googleSuccess,
    googleFailure,
  } = context;
  if (loginStatus) {
    return <Navigate to="/logout" />;
  }

  return (
    <>
      <style>
        {`
          body {
            display: flex;
            margin: -20px 0 50px;
            font-family: "Montserrat", sans-serif;
          }

    
        `}
      </style>
      <div className="parent_div">
        <div className="container" id="container">
          <div className="form-container sign-in-container">
            <form onSubmit={(e) => login({ creds: { username, password }, e })}>
              <h1>Sign in</h1>
              <div className="social-container">
                <GoogleLogin
                  onSuccess={googleSuccess}
                  onError={googleFailure}
                  ux_mode="popup"
                />
              </div>

              <span>or use your account</span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="bottom_btn">
                <p>Don't have an account ?</p> <Link to="/signup">Sign up</Link>
              </div>
              <button type="submit">Sign In</button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
