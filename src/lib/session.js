const { Session } = require("./sequelize")
const { Op } = require("sequelize")
const moment = require("moment")

const verifySession = async (token) => {
      const findSession = await Session.findOne({
          where: {
              token,
              is_valid: true,
              valid_until: {
                  [Op.gt]: moment().utc()
              }
          }
      })
      
      return findSession
}

module.exports = {
    verifySession
}