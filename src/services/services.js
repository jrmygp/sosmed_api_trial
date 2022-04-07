// class Service {

//     static handleServerError = (err, res) => {
//         res.status(500).json({
//             message: "Server error"
//         })
//     }
//     static handleClientError = (err = {
//         statusCode: 400
//     }, res) => {
//         res.status(err.statusCode).json({
//             message: err.message || "Client error"
//         })
//     }
//     static handleSuccess = (result, res) => {
//         res.status(result.statusCode || 200).json({
//             message: result.message,
//             result: result.data
//         })
//     }
// }



// module.exports = Service

class Service {
    static handleError = ({
      message = "Server error",
      statusCode = 500
    }) => {
      return {
        success: false,
        message,
        statusCode
      }
    }
  
    static handleSuccess = ({
      data = undefined,
      message = "Request success",
      statusCode = 200
    }) => {
      return {
        success: true,
        data,
        message,
        statusCode
      }
    }
  }
  
  module.exports = Service