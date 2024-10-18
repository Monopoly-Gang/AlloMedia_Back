const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/register-client", AuthController.registerClient);

module.exports = router;
