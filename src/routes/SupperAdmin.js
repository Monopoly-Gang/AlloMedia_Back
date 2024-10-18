const express = require('express');
const router = express.Router();
const SupperAdminController = require('../controllers/SupperAdminController');

router.get('/', SupperAdminController.getRestaurants);
router.post('/createResto', SupperAdminController.createRestaurant);
router.put('/updateResto/:_id', SupperAdminController.updateRestaurant);
router.delete('/deleteResto/:_id', SupperAdminController.deleteRestaurant);

module.exports = router; // Utiliser module.exports
 