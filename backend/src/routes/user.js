const express = require("express");
const router = express.Router();
const user = require("../controllers/userController");
const auth = require("../middleware/auth");

// endpoints for regular users

router.get("/stores", auth, user.listStores);
router.post("/ratings", auth, user.submitRating);

module.exports = router;
