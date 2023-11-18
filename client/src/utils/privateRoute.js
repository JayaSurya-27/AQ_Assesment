import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ApiContext from "./../context/apiContext";

const PrivateRoute = () => {
  const context = useContext(ApiContext);
  const { loginStatus } = context;

  return loginStatus ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
