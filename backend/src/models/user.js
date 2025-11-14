const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

// Craeting model for User

module.exports = (sequelize) => {
  const User = sequelize.define(
    "user",
    {
      name: { type: DataTypes.STRING(60), allowNull: false },
      email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      address: { type: DataTypes.STRING(400), allowNull: true },
      role: {
        type: DataTypes.ENUM("admin", "user", "owner"),
        defaultValue: "user",
      },
    },
    {
      underscored: true,
      tableName: "users",
    }
  );

  // Hash password before create/update
  User.beforeCreate(async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.prototype.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
  };

  return User;
};
