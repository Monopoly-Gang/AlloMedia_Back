

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

module.exports = {
    getUsers,
    createUser
};