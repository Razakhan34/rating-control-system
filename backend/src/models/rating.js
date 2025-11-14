const { DataTypes } = require("sequelize");

// creating model for Rating

module.exports = (sequelize) => {
  const Rating = sequelize.define(
    "rating",
    {
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      // user_id and store_id will be created via associations
    },
    {
      underscored: true,
      tableName: "ratings",
    }
  );

  return Rating;
};
