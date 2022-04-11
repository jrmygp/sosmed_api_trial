const { DataTypes } = require("sequelize");

const Session = (sequelize) => {
  return sequelize.define("Session", {
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

module.exports = Session;
