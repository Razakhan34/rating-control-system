require("dotenv").config();
const app = require("./src/app");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // 1) Test DB connection
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync({ alter: true });

    // 3) Start server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}
start();
