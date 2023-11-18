import ApiContext from "./apiContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ApiState = (props) => {
  const [loginStatus, setLoginStatus] = useState(
    localStorage.getItem("loginStatus") === "true" || false
  );
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("accessToken")
  );

  const API_ENDPOINT =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000/";
  console.log(typeof API_ENDPOINT);
  console.log("API_ENDPOINT:", API_ENDPOINT);
  const navigateTo = useNavigate();

  useEffect(() => {
    localStorage.setItem("loginStatus", loginStatus.toString());
  }, [loginStatus]);

  // useEffect(() => {
  //   if (loading && authTokens) {
  //     updateToken();
  //   }

  //   const fourMinutes = 1000 * 60 * 4;

  //   const interval = setInterval(() => {
  //     if (authTokens) {
  //       updateToken();
  //     }
  //   }, fourMinutes);
  //   return () => clearInterval(interval);
  // }, [authTokens, loading]);

  const login = async ({ creds, e }) => {
    e.preventDefault();

    if (!creds || !creds.username || !creds.password) {
      console.error("Enter username and password");
      return;
    }

    const reqBody = {
      username: creds.username,
      password: creds.password,
    };
    console.log("Request URL:");

    try {
      const response = await axios.post(`${API_ENDPOINT}login`, reqBody, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        console.log(response.data);
        console.log(localStorage.getItem("accessToken"));
        console.log(localStorage.getItem("refreshToken"));
        setLoginStatus(true);
        navigateTo("/");
        toast.success("Login successful");
      } else {
        console.error("Login failed");
        setLoginStatus(false);
        console.log(loginStatus);
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error("Login failed");
      console.error("Error during login:", error);
    }
  };

  const logout = async (e) => {
    if (e) {
      e.preventDefault();
    }
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    setLoginStatus(false);
    setProfile(null);
    toast.success("Logout successful");
  };

  const signUp = async ({ creds, e }) => {
    e.preventDefault();

    const { userName, password, confirmPassword, name, email } = creds;

    if (!userName || !password || !confirmPassword || !name || !email) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const reqBody = {
      username: userName,
      password: password,
      name: name,
      email: email,
    };

    try {
      const response = await axios.post(`${API_ENDPOINT}signup`, reqBody, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status === 201) {
        console.log("API Response:", response.data);
        navigateTo("/login");
        toast.success("Sign up successful");
      } else {
        console.error("Sign up failed");
        toast.error("Sign up failed");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Sign up failed");
    }
  };

  return (
    <ApiContext.Provider
      value={{
        loginStatus,
        profile,
        login,
        logout,
        signUp,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiState;
