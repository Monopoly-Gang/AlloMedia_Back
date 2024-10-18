const { sendNotification , CreateClient } = require('../../services/Websocket/Notifications.js');

// Controller function for sending notifications
const sendNotificationController = (req, res) => {

  const { message } = req.body;
  const client = CreateClient();

  console.log(message , client );
  
  // const test = sendNotification(message);

  res.status(200).json({ success: true, message: 'Notification sent!' });
};


module.exports = { sendNotificationController };
