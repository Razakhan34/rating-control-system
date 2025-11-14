const { DataTypes } = require("sequelize");

// Craeting model for Store

module.exports = (sequelize) => {
  const Store = sequelize.define(
    "store",
    {
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(120), allowNull: true },
      address: { type: DataTypes.STRING(400), allowNull: true },
      // owner_id will be created as foreign key when association set
    },
    {
      underscored: true,
      tableName: "stores",
    }
  );

  return Store;
};
