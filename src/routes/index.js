const express = require('express');
const supperAdminRoutes = require('./SupperAdmin');
const authRouter = require('./auth');
const livreur=require('./livreur')

const router = express.Router();


router.use('/restaurants', supperAdminRoutes);

router.use('/auth', authRouter);
router.use('/livreurs',livreur)

module.exports = router;