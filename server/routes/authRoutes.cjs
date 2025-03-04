const express = require("express");
const { registerUser, loginUser, setupUserProfile, getUserProfile, updateUserProfile } = require("../controllers/authController.cjs");
const { authenticateToken } = require("../middleware/authMiddleware.cjs"); 


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/setup-profile", authenticateToken, setupUserProfile); 

// Fetch user profile (GET request)
router.get("/user-profile", authenticateToken, getUserProfile);

// Update user profile (PUT request)
router.put("/update-profile", authenticateToken, updateUserProfile);

module.exports = router;