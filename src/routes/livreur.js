const express = require('express');
const UserManagementController = require('../controllers/SupperAdmin/UserManagementController');
const inputValidator = require("../middleware/inputValidator");
const rateLimit = require('express-rate-limit');

// Add rate limiting for security
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5 // limit each IP to 5 create account requests per hour
});

const router = express.Router();

// Get all users
router.get('/', UserManagementController.getUsers);

// Create a new user with rate limiting and input validation
router.post(
    '/',
    createAccountLimiter,
    inputValidator(['fullName', 'email', 'password', 'phoneNumber', 'address', 'role']),
    UserManagementController.createUser
);

// Update an existing user with input validation
router.put(
    '/:id',
    inputValidator(['fullName', 'email', 'password', 'phoneNumber', 'address', 'role']),
    UserManagementController.updateUser
);

// Delete a user by ID
router.delete('/delete/:id', UserManagementController.deleteUser);

module.exports = router;
