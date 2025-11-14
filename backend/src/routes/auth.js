const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

// endpoints for authentication

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.post("/update-password", authMiddleware, auth.updatePassword);

module.exports = router;
