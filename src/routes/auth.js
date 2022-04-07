// const authControllers = require("../controllers")
// const { authorizedLoggenInUser } = require("../middlewares/authMiddleware")
// const AuthService = require("../services/auth")

// const router = require("express").Router()

// router.post("/login", AuthService.loginUser)
// router.post("/register", authControllers.registerUser)
// router.get("/refresh-token", authorizedLoggenInUser, authControllers.keepLogin)


// module.exports = router


const authControllers = require("../controllers/auth");
const { authorizedLoggenInUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/login", authControllers.loginUser)
router.post("/register", authControllers.registerUser)

// Verifikasi cara jwt
router.get("/refresh-token", authorizedLoggenInUser, authControllers.keepLogin)
router.get("/verify/:token", authControllers.verifyUser)
router.post("/resend-verification", authorizedLoggenInUser, authControllers.resendVerificationEmail)

// Verifikasi cara store token di database

router.post("/v2/register", authControllers.registerUserV2)
router.get("/v2/verify:token", authControllers.verifyUserV2)
router.post("/v2/resend-verification", authorizedLoggenInUser,authControllers.resendVerificationEmailV2)

module.exports = router;