const { DataTypes } = require("sequelize");

const OTP = (sequelize) => {
  return sequelize.define("OTP", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};

module.exports = OTP;
