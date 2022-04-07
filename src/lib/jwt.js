const jwt = require("jsonwebtoken");

const KEY = process.env.JWT_SECRET_KEY

const generateToken = (payload, expiresIn = "2d") => {
  const token = jwt.sign(payload, KEY, {
    expiresIn
  });
  return token;
};

const verifyToken = (token) => {
    const isVerified = jwt.verify(token, KEY)

    return isVerified
  };

  module.exports = {
      generateToken,
      verifyToken
  }
