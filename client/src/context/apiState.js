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
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("accessToken")
  );
  const [candidatRows, setCandidateRows] = useState([]);

  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
  console.log(typeof API_ENDPOINT);
  console.log("API_ENDPOINT:", API_ENDPOINT);
  const navigateTo = useNavigate();

  useEffect(() => {
    localStorage.setItem("loginStatus", loginStatus.toString());
  }, [loginStatus]);

  useEffect(() => {
    if (loading && authTokens) {
      updateToken();
    }

    const fourMinutes = 1000 * 60 * 4;

    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

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
      const response = await axios.post(`${API_ENDPOINT}api/token/`, reqBody, {
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
        getId(creds.username);
        setLoginStatus(true);
        navigateTo("/createProfile");
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
    localStorage.removeItem("isRecruiter");
    localStorage.removeItem("userId");
    setLoginStatus(false);
    setProfile(null);
    toast.success("Logout successful");
  };

  const googleSuccess = (response) => {
    const decoded = jwt_decode(response.credential);
    console.log(decoded);

    const reqBody = {
      username: decoded.email,
      password: decoded.sub,
      user_type: isRecruiter ? "Recruiter" : "Candidate",
    };

    try {
      const url = `${API_ENDPOINT}googleLogin/`;
      axios.post(url, reqBody).then((response) => {
        if (response.status === 200) {
          login({
            creds: { username: decoded.email, password: decoded.sub },
            e: { preventDefault: () => {} },
          });
          navigateTo("/createProfile");
        } else {
          console.error("Login failed");
          toast.error("Login failed");
        }
      });
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed");
    }
  };

  const googleFailure = (error) => {
    console.log(error);
    toast.error("Login failed");
  };

  const updateToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.log("Refresh token not found.");
      logout();
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINT}api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        console.error("Failed to refresh token:", response.statusText);
        toast.error("Please login again ");
        logout();
        return;
      }

      const data = await response.json();
      const { access, refresh } = data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      console.log("Token refresh successful");
    } catch (error) {
      console.error("Error during token refresh:", error);
      toast.error("Please login again ");
      logout();
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  const getId = async (username) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}getUserId/?username=${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("username", username);
        localStorage.setItem("userId", data.id);
        console.log("Updated data:", data);
        console.log(typeof localStorage.getItem("isRecruiter"));
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error getting user id:", error);
    }
  };

  const signUp = async ({ creds, e }) => {
    console.log("Sign up creds:", creds);
    console.log(API_ENDPOINT);
    e.preventDefault();

    const { userName, password, confirmPassword } = creds;

    if (!userName) {
      toast.error("Username cannot be empty");
      return;
    }

    if (!password) {
      toast.error("Password cannot be empty");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const reqBody = {
      username: userName,
      password: password,
      user_type: isRecruiter ? "Recruiter" : "Candidate",
    };

    try {
      const url = `${API_ENDPOINT}signup/`;
      const response = await axios.post(url, reqBody);

      console.log("API Response:", response.data);
      navigateTo("/login");
      toast.success("Sign up successful");
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        loginStatus,
        profile,
        isRecruiter,
        setIsRecruiter,

        login,
        logout,
        signUp,
        googleSuccess,
        googleFailure,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiState;
