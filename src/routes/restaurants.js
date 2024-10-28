const express = require('express');
const router = express.Router();
const RestoController = require('../controllers/SupperAdmin/RestoController');
const RestaurantRequestController = require('../controllers/SupperAdmin/RestaurantRequestController');
const UserManagementController = require('../controllers/SupperAdmin/UserManagementController');

const upload = require('../services/Multer');

const inputValidator = require("../middleware/inputValidator");




router.get('/', RestoController.getRestaurants);

router.post("/", 
    upload("uploads/restos").fields([
            { name: 'logo', maxCount: 1 },
            { name: 'banner', maxCount: 1 }
]), inputValidator([
    'fullName', 'email', 'password', 'phoneNumber', 'address', 'restaurantName', 'cuisineType', 'restaurantAddress', 'location'
]), RestoController.createRestaurant);

router.put('/updateResto/:_id', upload("uploads/restos").fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]), RestoController.updateRestaurant);

router.delete('/:id', RestoController.deleteRestaurant);

// get all restos for approval
router.get('/restosForApproval',RestaurantRequestController.getRestaurants );
// approve a restaurant
router.put('/approveRestaurant/:id', RestaurantRequestController.approveRestaurant);
// refuse a restaurant
router.delete('/refuseRestaurant/:id', RestaurantRequestController.refuseRestaurant);


module.exports = router; // Utiliser module.exports
 