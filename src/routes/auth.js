const express = require("express");
const tokenValidator = require("../middleware/tokenValidator");
const AuthController = require("../controllers/AuthController");
const inputValidator = require("../middleware/inputValidator");
const upload = require("../services/multer");

const router = express.Router();
router.post("/register-client", inputValidator(['fullName', 'email', 'password', 'phoneNumber', 'address']), AuthController.registerClient);
router.post("/register-restaurant", upload("uploads/restos").fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]), inputValidator([
    'fullName', 'email', 'password', 'phoneNumber', 'address', 'restaurantName', 'cuisineType', 'restaurantAddress', 'location'
]), AuthController.registerRestaurant);
router.get("/verify-email", tokenValidator.validateQuery, AuthController.verifyEmail);
router.post("/send-email-verification", AuthController.sendEmailVerification);
router.post("/login", AuthController.login);
router.post("/send-otp", inputValidator(['email']), AuthController.sendOtp);
router.post("/verify-otp", inputValidator(['otp']), AuthController.verifyOtp);
router.get("/refresh-token", tokenValidator.validateRefreshToken, AuthController.refreshToken);
router.get("/logout", tokenValidator.validateRefreshToken, AuthController.logout);
router.post("/forgot-password", inputValidator(['email']), AuthController.forgotPassword);
router.get("/reset-password/verify", tokenValidator.validateQuery, AuthController.verifyResetPassword);
router.post("/reset-password/:token", tokenValidator.validateParams, inputValidator(['password']), AuthController.resetPassword);

module.exports = router;
