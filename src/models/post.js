const { DataTypes } = require("sequelize")

const Post = (sequelize) => {
    return sequelize.define(
        "Post",
        {
            image_url: {
                type: DataTypes.STRING,
                allowNull: false
            },
            caption: {
                type: DataTypes.STRING,
                allowNull: true
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }
    )
}

module.exports = Post