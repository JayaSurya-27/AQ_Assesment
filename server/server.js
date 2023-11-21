const { Pool } = require("pg");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const e = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token is missing." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = user;
    next();
  });
};

app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required." });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Check if the token is expired or invalid
    if (!decoded || !decoded.userId) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    // Retrieve user details from the database based on the userId in the token
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query(query, [decoded.userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "15m", // Set an appropriate expiration time
      }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Register a new user
app.post("/signup", async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    if (!username || !password || !name || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const result = await pool.query(
      "INSERT INTO users (username, password, name, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, hashedPassword, name, email]
    );

    const user = result.rows[0];
    res.status(201).json({ userId: user.id, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login and get a JWT token
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email, // Assuming there is an email field in your users table
        name: user.name, // Assuming there is a name field in your users table
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Protected route example
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route.", user: req.user });
});

app.post("/linkedin/access-token", async (req, res) => {
  const { code } = req.body;
  const clientId = "YOUR_CLIENT_ID";
  const clientSecret = "YOUR_CLIENT_SECRET";
  const redirectUri = "YOUR_REDIRECT_URI";
  console.log(code);

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: "86mrrthdb5hpim",
    client_secret: "88Z7TXDrE1u9mx8i",
    redirect_uri: "http://localhost:3000/linkedin",
  });

  try {
    const response = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const data = await response.json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.post("/uploadToLinkedIn", async (req, res) => {

//   try {
//     const { code } = "req.body";
//     // Handle LinkedIn API requests here using Axios or another HTTP library
//     // Perform the steps to register the image upload and create the image share

//     // Example:
//     console.log("img upload");
//     console.log(code);
//     const registerUploadResponse = await axios.post(
//       "https://api.linkedin.com/v2/assets?action=registerUpload",
//       {
//         /* Your request payload */
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${code}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Handle the response and perform subsequent steps (upload image, create share, etc.)

//     res.status(200).send("Image upload initiated successfully");
//   } catch (error) {
//     console.error("Error uploading image to LinkedIn:", error);
//     res.status(500).send("Internal server error");
//   }
// });

// app.post("/uploadToLinkedIn", upload.single("file"), async (req, res) => {
//   try {
//     const {
//       file,
//       body: { accessToken },
//     } = req;

//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     const fileData = fs.readFileSync(file.path);

//     const form = new FormData();
//     form.append("file", fileData, {
//       filename: file.originalname,
//       contentType: file.mimetype,
//     });

//     const headers = {
//       Authorization: `Bearer ${accessToken}`,
//       ...form.getHeaders(),
//     };

//     const config = {
//       headers: {
//         ...headers,
//         ...form.getHeaders(), // Update the headers here as well
//       },
//     };

//     // Convert form data to a buffer before sending
//     const bufferData = Buffer.from(form.getBuffer(), "binary");

//     const uploadResponse = await axios.post(
//       "https://api.linkedin.com/mediaUpload/C5522AQGTYER3k3ByHQ/feedshare-uploadedImage/0?ca=vector_feedshare&cn=uploads&m=AQJbrN86Zm265gAAAWemyz2pxPSgONtBiZdchrgG872QltnfYjnMdb2j3A&app=1953784&sync=0&v=beta&ut=2H-IhpbfXrRow1",
//       bufferData, // Sending buffer data instead of form directly
//       config // Passing the updated configuration
//     );

//     const mediaId = uploadResponse.data.asset;

//     // Rest of your LinkedIn API interaction code...

//     return res
//       .status(200)
//       .json({ message: "Posted to LinkedIn successfully!" });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads"); // Destination folder for uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.originalname}`); // Keeping the original filename
//   },
// });
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // Example limit: 1MB file size
}).single("image"); // Expecting a single file with the field name 'image'

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Endpoint to handle the image upload
app.post("/upload", (req, res) => {
  console.log("uploading file");
  upload(req, res, (err) => {
    if (err) {
      // Handle multer upload error
      return res
        .status(400)
        .json({ message: "File upload failed", error: err.message });
    }
    // File uploaded successfully
    return res.json({ message: "File uploaded successfully" });
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
