const { Router } = require("express");
const User = require("../models/user");

const router = Router();

// Serve signin page (basic message or JSON response)
router.get("/signin", (req, res) => {
  return res.send("Signin page. Please provide email and password.");
});

// Serve signup page (basic message or JSON response)
router.get("/signup", (req, res) => {
  return res.send("Signup page. Please provide your details to register.");
});

// Handle signin request
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // Send token as cookie and redirect
    res.cookie("token", token);
    return res.status(200).json({ message: "Signed in successfully", token });
  } catch (error) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
});

// Handle logout request
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
});

// Handle signup request
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: "Email is already in use", 
        message: "The email address you entered is already associated with an existing account."
      });
    }

    // Create a new user
    await User.create({ fullName, email, password });
    return res.status(201).json({ message: "Signup successful. You can now sign in." });
  } catch (error) {
    console.error(error);  // Log the error details for debugging purposes
    return res.status(500).json({
      error: "Failed to create user. Try again.",
      message: error.message  // Send the error message as part of the response
    });
  }
});

router.get("/userData", async (req, res) => {
  const user = req.user;

  console.log("User:", user);
  res.json({ user });
});

module.exports = router;
