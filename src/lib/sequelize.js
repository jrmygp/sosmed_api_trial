const { Sequelize } = require("sequelize");
const mysqlConfig = require("../configs/database");

const sequelize = new Sequelize({
  username: mysqlConfig.MYSQL_USERNAME,
  password: mysqlConfig.MYSQL_PASSWORD,
  database: mysqlConfig.MYSQL_DB_NAME,
  port: 3306,
  dialect: "mysql",
  logging: false,
});
const Post = require("../models/post")(sequelize);
const User = require("../models/user")(sequelize);
const Like = require("../models/like")(sequelize);
const VerificationToken = require("../models/verification_tokens")(sequelize);
const Session = require("../models/session")(sequelize);
const OTP = require("../models/otp")(sequelize);

//Associations
// (One to Many)
Post.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Post, { foreignKey: "user_id" });

//(Many to Many)
// Post.belongsToMany(User, { through: Like})
// User.belongsToMany(Post, { through: Like})
User.hasMany(Like, { foreignKey: "user_id" });
Like.belongsTo(User, { foreignKey: "user_id" });
Post.hasMany(Like, { foreignKey: "post_id" });
Like.belongsTo(Post, { foreignKey: "post_id" });

VerificationToken.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(VerificationToken, { foreignKey: "user_id" });

Session.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Session, { foreignKey: "user_id" });

OTP.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(OTP, { foreignKey: "user_id" });


module.exports = {
  sequelize,
  Post,
  User,
  Like,
  VerificationToken,
  Session,
  OTP,
};
