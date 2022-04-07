// const { User } = require("../../lib/sequelize");
// const Service = require("../services");

// class UserService extends Service {
//     static handleSuccess = ({
//         data= findUsers,
//         message= "Request success",
//         statusCode= 200
//     }) => {
//         return {
//             success: true,
//             data,
//             message,
//             statusCode
//         }
//     }
// static getAllUsers = async (req) => {
// try {
//     const findUsers = await User.findAll({
//         ...req.query
//     })
//     return this.handleSuccess({
//         message: "Found all users",
//         data: findUsers
//     })
// } catch (err) {
//     return {
//         success: false,
//         message: "Server Error",
//         statusCode: 500
//     }
// }
// }
// }

// module.exports = UserService

const { User } = require("../../lib/sequelize");
const Service = require("../services");

class UserService extends Service {
  static getAllUsers = async (req) => {
    try {
      const findUsers = await User.findAll({
        where: {
          ...req.query
        }
      });

      if (!findUsers.length) {
        return this.handleError({
          message: "No users found",
          statusCode: 400
        })
      }

      return this.handleSuccess({
        message: "Find all users",
        data: findUsers
      })
    } catch (err) {
      return this.handleError()
    }
  }

  static createNewUser = async (req) => {
    try {
      const { username } = req.body;

      const findUserWithUsername = await this.getAllUsers({
        query: {
          username
        }
      })

      if (!findUserWithUsername.success) return this.handleError();

      // Check apakah username sudah pernah digunakan
      if (findUserWithUsername.success && findUserWithUsername.data.length) {
        return this.handleError({
          message: "username has been used",
          statusCode: 400
        })
      }

      await User.create({
        username
      })

      return this.handleSuccess({
        message: "Created user",
        statusCode: 201
      })
    } catch (err) {
      return this.handleError();
    }
  }
}

module.exports = UserService