const express = require('express');
const router = express.Router();
const RestoController = require('../controllers/SupperAdmin/RestoController');
const RestaurantRequestController = require('../controllers/SupperAdmin/RestaurantRequestController');
const UserManagementController = require('../controllers/SupperAdmin/UserManagementController');


const inputValidator = require("../middleware/inputValidator");


const upload = require('../services/Multer');

// Add rate limiting for security
const rateLimit = require('express-rate-limit');
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 5 // limit each IP to 5 create account requests per hour
});

router.get('/', RestoController.getRestaurants);
router.post('/createResto', upload("uploads/restos").fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]), RestoController.createRestaurant);


router.put('/updateResto/:_id', upload("uploads/restos").fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]), RestoController.updateRestaurant);

router.delete('/deleteResto/:_id', RestoController.deleteRestaurant);

// get all restos for approval
router.get('/restosForApproval',RestaurantRequestController.getRestaurants );
// approve a restaurant
router.put('/approveRestaurant/:_id', RestaurantRequestController.approveRestaurant);
// refuse a restaurant
router.delete('/refuseRestaurant/:_id', RestaurantRequestController.refuseRestaurant);

// get all users
router.get('/users', UserManagementController.getUsers);
router.post(
    '/users/create', 
    createAccountLimiter,  // Add rate limiting
    inputValidator(['fullName', 'email', 'password', 'phoneNumber', 'address',"role"]),
    UserManagementController.createUser
);
router.put('/users/update/:_id',  inputValidator(
    ['fullName', 'email', 'password', 'phoneNumber', 'address',"role"]),
    UserManagementController.updateUser
);

router.delete('/users/delete/:_id', UserManagementController.deleteUser);

module.exports = router; // Utiliser module.exports
 