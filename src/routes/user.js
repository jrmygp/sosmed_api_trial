// const UserService = require("../services/user")

// const router = require("express").Router()

// router.get("/", async (req, res) => {
//     try {
//         const serviceResult = await UserService.getAllUsers(req)

//         if(!serviceResult.success) throw serviceResult

//         return res.status(serviceResult.statusCode || 200).json({
//             message: serviceResult.message,
//             result: serviceResult.data
//         })
//     } catch (err) {
//         return res.status(err.statusCode || 500).json({
//             message: err.message
//         })
//     }
// })

// module.exports = router

const UserService = require("../services/user");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const serviceResult = await UserService.getAllUsers(req);

    if (!serviceResult.success) throw serviceResult;

    return res.status(serviceResult.statusCode || 200).json({
      message: serviceResult.message,
      result: serviceResult.data
    })
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message
    })
  }
})

module.exports = router;