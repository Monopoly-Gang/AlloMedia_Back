const express = require('express');
const Router = express.Router();

// Import the separate routers
const MenuRouter = require('./MenuRouter');
// const NotificationRouter = require('./NotificationRouter');

Router.use('/MenuItem', MenuRouter);    
// Router.use('/Notification', NotificationRouter); 

module.exports = Router;
