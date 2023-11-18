import React from "react";
import { Navigate } from "react-router-dom";
import ApiContext from "../context/apiContext";
import "./../css/login.css";

const Logout = () => {
  const context = React.useContext(ApiContext);
  const { loginStatus, logout, authTokens } = context;

  if (!loginStatus) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="parent_div">
      <h1>Logout Page</h1>
      <button onClick={(e) => logout(e)}>Logout</button>
    </div>
  );
};

export default Logout;
