const { Sequelize } = require("sequelize")
const mysqlConfig = require("../configs/database")

const sequelize = new Sequelize({
    username: mysqlConfig.MYSQL_USERNAME,
    password: mysqlConfig.MYSQL_PASSWORD,
    database: mysqlConfig.MYSQL_DB_NAME,
    port: 3306,
    dialect: "mysql",
    logging: false
})
const Post = require("../models/post")(sequelize)
const User = require("../models/user")(sequelize)
const Like = require("../models/like")(sequelize)

//Associations
// (One to Many)
Post.belongsTo(User, { foreignKey: "user_id"})
User.hasMany(Post, { foreignKey: "user_id"})

//(Many to Many)
// Post.belongsToMany(User, { through: Like})
// User.belongsToMany(Post, { through: Like})
User.hasMany(Like, { foreignKey: "user_id"})
Like.belongsTo(User, { foreignKey: "user_id"})
Post.hasMany(Like, { foreignKey: "post_id"})
Like.belongsTo(Post, { foreignKey: "post_id"})

module.exports = {
    sequelize,
    Post,
    User,
    Like
}