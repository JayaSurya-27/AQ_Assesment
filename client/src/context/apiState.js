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
  const [isLinkedIn, setIsLinkedIn] = useState(false);
  const [currentuser, setCurrentuser] = useState([]);
  const [linkedInAuthToken, setlinkedInAuthToken] = useState(null);
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("accessToken")
  );

  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
  console.log(typeof API_ENDPOINT);
  console.log("API_ENDPOINT:", API_ENDPOINT);
  const navigateTo = useNavigate();

  useEffect(() => {
    localStorage.setItem("loginStatus", loginStatus.toString());
  }, [loginStatus]);

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
        setCurrentuser(response.data.user);
        console.log("Current User:", currentuser);
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
    localStorage.removeItem("loginStatus");
    localStorage.removeItem("linkedInAuthToken");
    localStorage.removeItem("linkedInAccessToken");
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

  const fetchUserInfo = async () => {
    try {
      const code = localStorage.getItem("linkedInAuthToken");
      const reqBody = {
        code: code,
      };
      const response = await axios.post(
        `${API_ENDPOINT}linkedin/access-token`,
        reqBody,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      // console.log(response);
      if (response.status === 200) {
        console.log(response);
        localStorage.setItem(
          "linkedInAccessToken",
          response.data.data.access_token
        );
        const sub = response.data.decodedData.sub;
        localStorage.setItem("sub", sub);
        const obj = {
          name: response.data.decodedData.name,
          email: response.data.decodedData.email,
          username: response.data.decodedData.email,
        };
        setCurrentuser(obj);
      }
      console.log(
        "setting access token",
        localStorage.getItem("linkedInAccessToken")
      );
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  };

  const testing = async () => {
    try {
      const response = await axios.get(
        "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86mrrthdb5hpim&redirect_uri=http://localhost:3000/linkedin&state=foobar&scope=w_member_social"
      );
      console.log(response);
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  };

  async function createLinkedInPost(text) {
    const url = "https://api.linkedin.com/v2/ugcPosts";
    const accessToken = localStorage.getItem("linkedInAccessToken");
    const sub = localStorage.getItem("sub");

    const requestBody = {
      author: `urn:li:person:${sub}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: text,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      return data; // Return the response data
    } catch (error) {
      console.error("Error creating LinkedIn post:", error);
      throw error;
    }
  }

  return (
    <ApiContext.Provider
      value={{
        loginStatus,
        profile,
        login,
        logout,
        signUp,
        setLoginStatus,

        linkedInAuthToken,
        setlinkedInAuthToken,
        isLinkedIn,
        setIsLinkedIn,
        fetchUserInfo,
        currentuser,
        testing,
        createLinkedInPost,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiState;
