import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Divider,
  Grid,
  createTheme,
} from "@mui/material";
import { ThemeProvider } from "styled-components";
import { Avatar } from "@mui/material";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Paper } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { nanoid } from "nanoid";
import ScienceIcon from "@mui/icons-material/Science";
import SchoolIcon from "@mui/icons-material/School";
import { BallTriangle } from "react-loader-spinner";
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

const exprSearalizer = (data) => {
  let arrData = data.split("},");
  for (let i = 0; i < arrData.length - 1; i++) {
    arrData[i] = arrData[i] + "}";
  }
  for (let i = 0; i < arrData.length; i++) {
    arrData[i] = JSON.parse(arrData[i]);
  }
  return arrData;
};

export default function ViewProfileCandidate() {
  // const storedToken = localStorage.getItem("linkedInAuthToken");
  // console.log("Stored Token:", storedToken);

  // if (storedToken) {
  //   try {
  //     const decodedToken = jwtDecode(storedToken);
  //     console.log("Decoded Token:", decodedToken);
  //   } catch (error) {
  //     console.error("Error decoding token:", error);
  //   }
  // } else {
  //   console.error("No token found in localStorage");
  // }

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
  const [isLoading, setIsLoading] = useState(1);
  const [currUser, setCurrUser] = useState([]);
  const [interExp, setInternExp] = useState([]);
  const [researchExp, setResearchExp] = useState([]);
  const [acads, setAcads] = useState([]);

  useEffect(() => {
    let mounted = true;
    let accToken = localStorage.getItem("accessToken");
    let uid = localStorage.getItem("userId");
    getCandidate(accToken, uid).then((result) => {
      if (mounted) {
        setIsLoading(0);
        setCurrUser(result.data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (currUser) {
        console.log(currUser);
        if (currUser.internship_exp) {
          const intern = currUser.internship_exp;
          const internSer = exprSearalizer(intern);
          setInternExp(internSer);
        }
        if (currUser.research_exp) {
          const resExpr = currUser.research_exp;
          const resSer = exprSearalizer(resExpr);
          setResearchExp(resSer);
        }
        if (currUser.academic_Record) {
          const acads = currUser.academic_Record;
          const acadsSer = exprSearalizer(acads);
          setAcads(acadsSer);
        }
      }
    }
    return () => {
      isMounted = false;
    };
  }, [currUser]);

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
          {isLoading ? (
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="#6360db"
              ariaLabel="ball-triangle-loading"
              wrapperClass={{}}
              wrapperStyle=""
              visible={true}
            />
          ) : (
            <>
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Welcome, {localStorage.getItem("username")}
              </Typography>
              <div>
                <Upload />
              </div>
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
                      {currUser.email}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      Phone Number
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {currUser.phone_number}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      Role
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {currUser.role}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      Resume
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {currUser.resume ? (
                        <a
                          href={`file:///C:/Users/nitin/Projects/EuPrime/job-portal-backend-main/jobPortal${currUser.resume.uploaded_file}`}
                          target="_blank"
                        >
                          Resume
                        </a>
                      ) : (
                        "NA"
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              </Paper>
              <Paper
                align="center"
                elevation={10}
                sx={{
                  marginBottom: 5,
                  marginTop: 3,
                  paddingLeft: 3,
                  paddingRight: 3,
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <WorkIcon />
                </Avatar>
                <Divider>
                  <Typography component="h1" variant="h5">
                    Internships
                  </Typography>
                </Divider>
                <Grid container spacing={2} p={2} sx={{ marginTop: 1 }}>
                  {interExp.map((ele) => {
                    return (
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
                            Position
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {ele.position}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            Duration
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {ele.duration} Months
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            Location
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {ele.location}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            Description
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {ele.description}
                          </Grid>
                        </Grid>
                      </Paper>
                    );
                  })}
                </Grid>
              </Paper>
              <Paper
                align="center"
                elevation={10}
                sx={{
                  marginBottom: 5,
                  marginTop: 3,
                  paddingLeft: 3,
                  paddingRight: 3,
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <ScienceIcon />
                </Avatar>
                <Divider>
                  <Typography component="h1" variant="h5">
                    Research Experience
                  </Typography>
                </Divider>
                <Grid container spacing={2} p={2} sx={{ marginTop: 1 }}>
                  {researchExp.map((ele) => {
                    return (
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
                        <Grid container spacing={2} p={2} key={nanoid()}>
                          <Grid item xs={12} sm={6}>
                            Research Title
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {ele.researchTitle}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            Duration
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {ele.duration} Months
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            Location:
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {ele.location}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            Description:
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {ele.description}
                          </Grid>
                        </Grid>
                      </Paper>
                    );
                  })}
                </Grid>
              </Paper>
              <Paper
                align="center"
                elevation={10}
                sx={{
                  marginBottom: 5,
                  marginTop: 3,
                  paddingLeft: 3,
                  paddingRight: 3,
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <SchoolIcon />
                </Avatar>
                <Divider>
                  <Typography component="h1" variant="h5">
                    Academic
                  </Typography>
                </Divider>
                <Grid container spacing={2} p={2} sx={{ marginTop: 1 }}>
                  {acads.map((ele) => {
                    return (
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
                        <Grid container spacing={2} p={2} key={nanoid()}>
                          <Grid item xs={12} sm={6}>
                            University Name
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {ele.univName}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            Location
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {ele.location}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            Grade
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {ele.percentage}
                          </Grid>
                        </Grid>
                      </Paper>
                    );
                  })}
                </Grid>
              </Paper>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
