// Import required modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// Create an Express application
const app = express();
const port = 3000; // Specify the port to listen on

// Middleware for parsing
app.use(bodyParser.urlencoded({ extended: false })); // Parse JSON bodies
app.use(bodyParser.json());

// Middleware function for logging
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;

  // Log request details
  console.log(`[${timestamp}] ${method} ${url}`);

  next();
};

// Register the logger middleware
app.use(loggerMiddleware);

// Set the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up routes
app.get("/", (req, res) => {
  res.render("home"); // Render the home.ejs template
});

app.get("/contact", (req, res) => {
  res.render("contact"); // Render the about.ejs template
});

app.get("/submitted", (req, res) => {
  res.render("submitted"); // Render the about.ejs template
});

// Handle the POST request for submitting feedback
app.post("/submitFeedback", async (req, res) => {
  const { email, feedback } = req.body;
  // Check if email is provided
  if (!email) {
    throw new Error("Email is required."); // Throw an error if email is not provided
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(email);

  // If email is not valid, throw an error
  if (!emailValid) {
    throw new Error("Invalid email format.");
  }
  res.render("submitted", { email: email, feedback: feedback }); // Render the submitted.ejs template
});

// Handle the POST request for purchase
app.post("/purchase", async (req, res) => {
  console.log(req.body);
  const { version } = req.body;
  try {
    let message;
    if (version === "basic") {
      // Process purchase for basic version
      message = "Purchase successful! You have bought the Basic Version.";
    } else if (version === "premium") {
      // Process purchase for premium version
      message = "Purchase successful! You have bought the Premium Version.";
    } else {
      // Invalid version
      return res.status(400).json({ message: "Invalid version." });
    }
    res.json({ message });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
app.get("/about", async (req, res) => {
  try {
    const totalUsers = "10 million";

    // Render the about.ejs template and pass totalUsers data
    res.render("about", { totalUsers });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).send("Internal server error.");
  }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Define a catch-all route for invalid routes
app.use((req, res) => {
  res.status(404).send("404 - Not Found"); // Respond with 404 status for invalid routes
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
