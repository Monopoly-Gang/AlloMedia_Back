

const User = require("../../models/User");
const { sendResponse } = require("../../utils/sendResponse");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
    try {
        // Add pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find()
                .select('-password')  // Exclude password field
                .skip(skip)
                .limit(limit),
            User.countDocuments()
        ]);

        return sendResponse(res, 200, {
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                hasMore: page * limit < total
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return sendResponse(res, 500, null, 'Failed to fetch users');
    }
};

const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 422, null, 'Validation failed', errors.array());
        }

        const { fullName, email, password, phoneNumber, address } = req.body;

        // Check if user already exists - use case-insensitive email check
        const existingUser = await User.findOne({ 
            email: { $regex: new RegExp(`^${email}$`, 'i') } 
        });
        
        if (existingUser) {
            return sendResponse(res, 409, null, 'Email already registered');
        }

        // Hash password
        const saltRounds = 12;  // Increased for better security
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user with sanitized data
        const newUser = await User.create({
            fullName: fullName.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            phoneNumber: phoneNumber.replace(/\s+/g, ''),  // Remove any whitespace
            address: address.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Remove password from response and convert to plain object
        const userResponse = newUser.toObject();
        delete userResponse.password;

        return sendResponse(res, 201, userResponse, 'User created successfully');

    } catch (error) {
        console.error('Error creating user:', error);
        
        // Handle specific database errors
        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            if (error.code === 11000) {
                return sendResponse(res, 409, null, 'Email already exists');
            }
        }

        return sendResponse(res, 500, null, 'Internal server error');
    }
};

const updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 422, null, 'Validation failed', errors.array());
        }

        const userId = req.params._id;
        const { fullName, email, password, phoneNumber, address } = req.body;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return sendResponse(res, 404, null, 'User not found');
        }

        // Check if the email is being updated and if it already exists for another user
        if (email && email.toLowerCase() !== user.email.toLowerCase()) {
            const emailExists = await User.findOne({ 
                email: { $regex: new RegExp(`^${email}$`, 'i') } 
            });
            if (emailExists) {
                return sendResponse(res, 409, null, 'Email already registered by another user');
            }
        }

        // Update fields, hash password if it’s being updated
        if (password) {
            const saltRounds = 12;
            user.password = await bcrypt.hash(password, saltRounds);
        }

        user.fullName = fullName ? fullName.trim() : user.fullName;
        user.email = email ? email.toLowerCase() : user.email;
        user.phoneNumber = phoneNumber ? phoneNumber.replace(/\s+/g, '') : user.phoneNumber;
        user.address = address ? address.trim() : user.address;
        user.updatedAt = new Date();

        await user.save();

        // Remove password from the response
        const userResponse = user.toObject();
        delete userResponse.password;

        return sendResponse(res, 200, userResponse, 'User updated successfully');

    } catch (error) {
        console.error('Error updating user:', error);
        return sendResponse(res, 500, null, 'Failed to update user');
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params._id;

        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return sendResponse(res, 404, null, 'User not found');
        }

        return sendResponse(res, 200, null, 'User deleted successfully');
        
    } catch (error) {
        console.error('Error deleting user:', error);
        return sendResponse(res, 500, null, 'Failed to delete user');
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,   // Export the update function
    deleteUser    // Export the delete function
};
