const express = require('express');
const supperAdminRoutes = require('./SupperAdmin');

const router = express.Router();


router.use('/restaurants', supperAdminRoutes);

module.exports = router;