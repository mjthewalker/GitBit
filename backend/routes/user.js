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
    await User.create({ fullName, email, password });
    return res.status(201).json({ message: "Signup successful. You can now sign in." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create user. Try again." });
  }
});

module.exports = router;
