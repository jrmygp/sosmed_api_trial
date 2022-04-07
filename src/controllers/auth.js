const { User, VerificationToken } = require("../lib/sequelize");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../lib/jwt");
const mailer = require("../lib/mailer");
const mustache = require("mustache");
const fs = require("fs");
const { nanoid } = require("nanoid");
const { moment } = require("moment");

const authControllers = {
  registerUser: async (req, res) => {
    try {
      const { username, email, full_name, password, role } = req.body;

      const isUsernameEmailTaken = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (isUsernameEmailTaken) {
        return res.status(400).json({
          message: "Username or email has already been taken",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);
      const createNewUser = await User.create({
        username,
        email,
        full_name,
        password: hashedPassword,
        role,
      });

      //Verification Email
      const verificationToken = generateToken({
        id: createNewUser.id,
        isEmailVerificvation: true,
      });

      const verificationLink = `http://localhost:2020/auth/verify/${verificationToken}`;

      const template = fs
        .readFileSync(__dirname + "/../templates/verify.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        username,
        verify_url: verificationLink,
      });
      await mailer({
        to: email,
        subject: "Verify your account!",
        html: renderedTemplate,
      });
      return res.status(201).json({
        message: "Account registered successfully!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const findUser = await User.findOne({
        where: {
          username,
        },
      });
      if (!findUser) {
        return res.status(400).json({
          message: "Wrong username or password!",
        });
      }
      const isPasswordCorrect = bcrypt.compareSync(password, findUser.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          message: "Wrong username or password!",
        });
      }
      delete findUser.dataValues.password;

      const token = generateToken({
        id: findUser.id,
        role: findUser.role,
      });

      await mailer({
        to: findUser.email,
        subject: "Logged in account",
        text: "An account using your email has logged in",
      });

      return res.status(200).json({
        message: "Logged in user",
        result: {
          user: findUser,
          token,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  keepLogin: async (req, res) => {
    try {
      const { token } = req;
      const renewedToken = generateToken({ id: token.id });
      const findUser = await User.findByPk(token.id);
      delete findUser.dataValues.password;
      return res.status(200).json({
        message: "Renewed user token",
        result: findUser,
        token: renewedToken,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  verifyUser: async (req, res) => {
    try {
      const { token } = req.params;

      const isTokenVerified = verifyToken(token);

      if (!isTokenVerified || !isTokenVerified.isEmailVerification) {
        return res.status(400).json({
          message: "Token invalid",
        });
      }

      await User.update(
        { is_verified: true },
        {
          where: {
            id: isTokenVerified.id,
          },
        }
      );
      // return res.status(200).json({
      //   message: "User verified!"
      // })
      return res.redirect(
        `http://localhost:3000/verification-success?referral=${token}`
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  resendVerificationEmail: async (req, res) => {
    try {
      const userId = req.token.id;
      const findUser = await User.findByPk(userId);

      if (findUser.is_verified) {
        return res.status(400).json({
          message: "User is already verified",
        });
      }

      const verificationToken = generateToken(
        {
          id: userId,
          isEmailVerification: true,
        },
        "1h"
      );

      const verificationLink = `http://localhost:2020/auth/verify/${verificationToken}`;

      await mailer({
        to: findUser.email,
        subject: "Verify your account!",
        html: `Click here to verify your account: <a href="${verificationLink}">link</a>`,
      });
      return res.status(201).json({
        message: "Account registered successfully!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  registerUserV2: async (req, res) => {
    try {
      const { username, email, full_name, password, role } = req.body;

      const isUsernameEmailTaken = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (isUsernameEmailTaken) {
        return res.status(400).json({
          message: "Username or email has already been taken",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);
      const createNewUser = await User.create({
        username,
        email,
        full_name,
        password: hashedPassword,
        role,
      });

      //Verification Email
      const verificationToken = nanoid(40);

      await VerificationToken.create({
        token: verificationToken,
        user_id: createNewUser.id,
        valid_until: moment().add(1, "hour"),
      }); 

      const template = fs
        .readFileSync(__dirname + "/../templates/verify.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        username,
        verify_url: verificationLink,
      });
      await mailer({
        to: email,
        subject: "Verify your account!",
        html: renderedTemplate,
      });
      return res.status(201).json({
        message: "Account registered successfully!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  verifyUserV2: async (req, res) => {
    try {
      const { token } = req.params;

      const findToken = await VerificationToken.findOne({
        where: {
          token,
          is_valid: true,
          valid_until: {
            [Op.gt]: moment().utc(),
          },
        },
      });

      if (!findToken) {
        return res.status(400).json({
          message: "Your token is invalid"
        })
      }

      await User.update(
        { is_verified: true },
        {
          where: {
            id: findToken.user_id,
          },
        }
      );
     
        findToken.is_valid = false
        findToken.save()

      return res.redirect(
        `http://localhost:3000/verification-success?referral=${token}`
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  resendVerificationEmailV2: async (req, res) => {
    try {
      const userId = req.token.id;
      const findUser = await User.findByPk(userId);

      if (findUser.is_verified) {
        return res.status(400).json({
          message: "User is already verified",
        });
      }

      const verificationToken = nanoid(40);

      await VerificationToken.update({
        is_valid: false,
      },
      {
        where : {
        is_valid: true,
        user_id: userId
      }
      })

      await VerificationToken.create({
        token: verificationToken,
        user_id: findUser.id,
        valid_until: moment().add(1, "hour"),
      });

      const verificationLink = `http://localhost:2020/auth/v2/verify/${verificationToken}`;

      const template = fs
        .readFileSync(__dirname + "/../templates/verify.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        username: findUser.username,
        verify_url: verificationLink,
      });
      await mailer({
        to: findUser.email,
        subject: "Verify your account!",
        html: renderedTemplate,
      });
  
      return res.status(201).json({
        message: "Account registered successfully!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  }
};

module.exports = authControllers;
