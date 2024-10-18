const express = require("express");
const router = express.Router();
const { searchRestaurant } = require("../controllers/ClientController");

router.get("/search",searchRestaurant);

module.exports = router;

 