const express = require('express');
const Router = express.Router();
const CreateMenuItem = require('../controllers/Manager/Menu/CreateMenuItem');
const upload = require('../services/Multer');

// Define your routes
Router.post('/CreateMenuItem', upload("uploads/MenuItems").single('image'), CreateMenuItem);
// Router.get('/', MenuItemController.GetMenuItems)

module.exports = Router;

