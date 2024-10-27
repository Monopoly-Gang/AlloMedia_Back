const express = require('express');
const Router = express.Router();
const GetAllOrders = require('../controllers/Manager/Orders/GetAllOrders');
const DeliveryStatus = require('../controllers/Manager/Orders/DeliveryStatus');


Router.get('/GetAllOrders/:id', GetAllOrders);
Router.post('/UpdateOrderStatus', DeliveryStatus);


module.exports = Router;