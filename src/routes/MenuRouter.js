const express = require('express');
const Router = express.Router();
const CreateMenuItem = require('../controllers/Manager/Menu/CreateMenuItem');
const UpdateMenuItem = require('../controllers/Manager/Menu/UpdateMenuItem');
const Upload = require('../middleware/Multer');

// Define your routes
Router.post('/CreateMenuItem', Upload("uploads/MenuItems" , "image"), CreateMenuItem);
// Router.get('/UpdateMenuItem', UpdateMenuItem )
module.exports = Router;

