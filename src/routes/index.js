const express = require('express');
const supperAdminRoutes = require('./SupperAdmin');
const authRouter = require('./auth');
const livreur=require('./livreur');
const MenuRouter = require('./MenuRouter'); 
const orderRouter = require('./orderRouter');

const router = express.Router();
router.use('/restaurants', supperAdminRoutes);

router.use('/auth', authRouter);
router.use('/livreurs',livreur);
router.use('/MenuItem', MenuRouter); 
router.use('/orders',orderRouter);
  

module.exports = router;











