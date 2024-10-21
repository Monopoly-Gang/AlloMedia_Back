const express = require('express');
const supperAdminRoutes = require('./SupperAdmin');
const authRouter = require('./auth');

const router = express.Router();


router.use('/restaurants', supperAdminRoutes);

router.use('/auth', authRouter);

module.exports = router;