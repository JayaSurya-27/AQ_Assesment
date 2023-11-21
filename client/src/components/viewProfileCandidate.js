import React, { useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Divider,
  Grid,
  createTheme,
} from "@mui/material";
import ApiContext from "../context/apiContext";
import { ThemeProvider } from "styled-components";
import { Avatar } from "@mui/material";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Paper } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { nanoid } from "nanoid";
import Upload from "../upload";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#6360db",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export default function ViewProfileCandidate() {
  const context = React.useContext(ApiContext);
  const [text, setText] = useState("");
  const { currentuser, logout, createLinkedInPost } = context;
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
  const getCandidate = async (accToken, uId) => {
    console.log("View Profile Candidate API Fecth Call");
    const url = API_ENDPOINT + "candidate/" + uId;
    const result = await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accToken}`,
        },
      })
      .catch((err) => {
        const mute = err;
      });
    return result;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    createLinkedInPost();
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <>
            <div
              style={{
                marginLeft: "80vw",
                marginTop: "-40px",
              }}
            >
              <button onClick={(e) => logout(e)}>Logout</button>
            </div>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Welcome, {localStorage.getItem("username")}
            </Typography>
            <Paper
              align="center"
              elevation={10}
              sx={{
                marginBottom: 5,
                marginTop: 3,
                paddingLeft: 3,
                paddingRight: 3,
                maxWidth: "md",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <AccountCircleOutlinedIcon />
              </Avatar>
              <Divider>
                <Typography component="h1" variant="h5">
                  Details
                </Typography>
              </Divider>
              <Paper
                align="center"
                elevation={2}
                sx={{
                  marginBottom: 5,
                  borderStyle: "solid",
                  borderColor: "rgba(0,0,0,0.1)",
                }}
                key={nanoid()}
              >
                <Grid container spacing={2} p={2}>
                  <Grid item xs={12} sm={6}>
                    Email
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {currentuser?.email}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Username
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {currentuser?.username}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Name
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {currentuser?.name}
                  </Grid>
                </Grid>
              </Paper>
            </Paper>
            <Upload />
            <br></br>
            <form onSubmit={handleSubmit}>
              <label>
                Enter your LinkedIn post text:
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </label>
              <button type="submit">Create Post</button>
            </form>
            <Paper
              align="center"
              elevation={10}
              sx={{
                marginBottom: 5,
                marginTop: 3,
                paddingLeft: 3,
                paddingRight: 3,
              }}
            ></Paper>
          </>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
