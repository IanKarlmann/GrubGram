const express = require("express");
const { registerUser, loginUser, setupUserProfile } = require("../controllers/authController.cjs");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/setup-profile", setupUserProfile); 

module.exports = router;