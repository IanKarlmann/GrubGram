const express = require("express");
const { registerUser, loginUser, setupUserProfile, getUserById, updateUserProfile } = require("../controllers/authController.cjs");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/setup-profile", setupUserProfile); 

router.get("/user/:userId", getUserById);
router.put("/update-profile", updateUserProfile);

module.exports = router;