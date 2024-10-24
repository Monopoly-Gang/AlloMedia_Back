const express = require("express");
const router = express.Router();
const { searchRestaurant } = require("../controllers/client/ClientController");

router.get("/search",searchRestaurant);

module.exports = router;

 