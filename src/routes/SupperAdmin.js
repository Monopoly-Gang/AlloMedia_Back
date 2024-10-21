const express = require('express');
const router = express.Router();
const RestoController = require('../controllers/SupperAdmin/RestoController');
const RestaurantRequestController = require('../controllers/SupperAdmin/RestaurantRequestController');

router.get('/', RestoController.getRestaurants);
router.post('/createResto', RestoController.createRestaurant);
router.put('/updateResto/:_id', RestoController.updateRestaurant);
router.delete('/deleteResto/:_id', RestoController.deleteRestaurant);

// get all restos for approval
router.get('/restosForApproval',RestaurantRequestController.getRestaurants );
// approve a restaurant
router.put('/approveRestaurant/:_id', RestaurantRequestController.approveRestaurant);
// refuse a restaurant
router.delete('/refuseRestaurant/:_id', RestaurantRequestController.refuseRestaurant);


module.exports = router; // Utiliser module.exports
 