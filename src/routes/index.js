const express = require('express');
const Router = express.Router();
const { sendNotificationController } = require('../controllers/Notifications/NotificationController.js');
const {getConnectedClients} = require('../services/Websocket/Connection.js');


Router.get('/send_notification', sendNotificationController);
Router.get('/web-socket', (req, res) => {
  const connectedClients = getConnectedClients();
  
  res.status(200).json({
    success: true,
    clients: connectedClients
  });
});


module.exports = Router;
