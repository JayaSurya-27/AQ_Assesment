import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import ApiContext from "../context/apiContext";
import "./../css/login.css";

function SignUp() {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const context = useContext(ApiContext);
  const { loginStatus, signUp } = context;

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
            <form
              onSubmit={(e) =>
                signUp({
                  creds: { userName, password, confirmPassword, email, name },
                  e,
                })
              }
            >
              <h1 style={{ marginBottom: "20px" }}>Sign Up</h1>

              <input
                type="string"
                placeholder="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="string"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="bottom_btn">
                <p>Already have an account ?</p>{" "}
                <Link to="/login">Sign In</Link>
              </div>
              <button type="submit">Sign Up</button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
