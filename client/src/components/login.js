import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import ApiContext from "../context/apiContext";
import "./../css/login.css";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const context = useContext(ApiContext);

  const { linkedInLogin } = useLinkedIn({
    clientId: "86vhj2q7ukf83q",
    redirectUri: `${window.location.origin}/linkedin`,
    onSuccess: (code) => {
      console.log(code);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { loginStatus, login } = context;
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
                <img
                  onClick={linkedInLogin}
                  src={linkedin}
                  alt="Sign in with Linked In"
                  style={{ maxWidth: "180px", cursor: "pointer" }}
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
