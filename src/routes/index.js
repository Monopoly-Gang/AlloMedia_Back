const express = require('express');
const Router = express.Router();

// Import the separate routers
const MenuRouter = require('./MenuRouter');
const OrdersRouter = require('./OrdersRouter');
const authRouter = require('./auth');
// const NotificationRouter = require('./NotificationRouter');

Router.use('/MenuItem', MenuRouter);    
Router.use('/Orders', OrdersRouter);
Router.use('/auth', authRouter);
// Router.use('/Notification', NotificationRouter); 


module.exports = Router;

