const express = require("express");
const OrderController = require("../controllers/OrderController");
const router = express.Router();

router.get("/:userId",OrderController.getOrdersByUserId);
router.post("/",OrderController.addOrder);
router.get("/order/:orderId",OrderController.getOrderById);

module.exports = router;