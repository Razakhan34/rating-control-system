const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminController");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");

// All endpoints here are for admin users only

router.get("/dashboard", auth, roles(["admin"]), admin.dashboard);
router.post("/users", auth, roles(["admin"]), admin.addUser);
router.put("/users/:id", auth, roles(["admin"]), admin.updateUser);
router.delete("/users/:id", auth, roles(["admin"]), admin.deleteUser);

router.post("/stores", auth, roles(["admin"]), admin.addStore);
router.put("/stores/:id", auth, roles(["admin"]), admin.updateStore);
router.delete("/stores/:id", auth, roles(["admin"]), admin.deleteStore);

router.get("/stores", auth, roles(["admin"]), admin.listStores);
router.get("/users", auth, roles(["admin"]), admin.listUsers);
router.get("/users/:id", auth, roles(["admin"]), admin.getUser);

module.exports = router;
