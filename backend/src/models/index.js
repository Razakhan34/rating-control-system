const Sequelize = require("sequelize");
const sequelize = require("../config/database");

// for creating relations between models

const User = require("./user")(sequelize);
const Store = require("./store")(sequelize);
const Rating = require("./rating")(sequelize);

// Associations (define them *after* models)
User.hasMany(Rating, { foreignKey: "user_id", onDelete: "CASCADE" });
Rating.belongsTo(User, { foreignKey: "user_id" });

Store.hasMany(Rating, { foreignKey: "store_id", onDelete: "CASCADE" });
Rating.belongsTo(Store, { foreignKey: "store_id" });

User.hasMany(Store, { foreignKey: "owner_id" });
Store.belongsTo(User, { foreignKey: "owner_id" });

// Export models and sequelize instance
module.exports = { sequelize, Sequelize, User, Store, Rating };
