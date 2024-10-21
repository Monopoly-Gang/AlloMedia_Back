const express = require("express");
const router = express.Router();
const tokenValidator = require("../middleware/tokenValidator");
const AuthController = require("../controllers/AuthController");

router.post("/register-client", AuthController.registerClient);
router.get("/verify-email", tokenValidator.validateQuery, AuthController.verifyEmail);
router.post("/send-email-verification", AuthController.sendEmailVerification);
router.post("/login", AuthController.login);

module.exports = router;
