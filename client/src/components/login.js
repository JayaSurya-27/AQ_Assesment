import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import ApiContext from "../context/apiContext";
import "./../css/login.css";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import { LinkedIn } from "react-linkedin-login-oauth2";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();
  const context = useContext(ApiContext);
  const FRONTURI = process.env.REACT_APP_FRONTEND_URI;
  const {
    loginStatus,
    login,
    setLoginStatus,
    setlinkedInAuthToken,
    setIsLinkedIn,
    fetchUserInfo,
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
                <LinkedIn
                  clientId="86mrrthdb5hpim"
                  redirectUri={`https://aq-assesment-client-cfk6ozcvv-jayasurya-27.vercel.app/linkedin`}
                  onSuccess={(code) => {
                    console.log(code);
                    setLoginStatus(true);
                    localStorage.setItem("linkedInAuthToken", code);
                    setlinkedInAuthToken(code);
                    setIsLinkedIn(true);
                    fetchUserInfo();
                    navigateTo("/");
                  }}
                  scope="email openid profile w_member_social"
                  onError={(error) => {
                    console.log(error);
                  }}
                >
                  {({ linkedInLogin }) => (
                    <img
                      onClick={linkedInLogin}
                      src={linkedin}
                      alt="Sign in with Linked In"
                      style={{ maxWidth: "180px", cursor: "pointer" }}
                    />
                  )}
                </LinkedIn>
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
