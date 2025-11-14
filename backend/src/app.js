const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const storeRoutes = require("./routes/store");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/store", storeRoutes);

// health check
app.get("/health", (req, res) =>
  res.json({ ok: true, msg: "API is running fine" })
);

module.exports = app;
