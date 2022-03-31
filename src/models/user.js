const { DataTypes } = require("sequelize");

const User = (sequelize) => {
  return sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
    }
  )
}

module.exports = User;