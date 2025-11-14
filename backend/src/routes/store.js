const express = require("express");
const router = express.Router();
const storeCtrl = require("../controllers/storeController");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");

// endpoints for store owners

router.get("/owner/dashboard", auth, roles(["owner"]), storeCtrl.myDashboard);

module.exports = router;
