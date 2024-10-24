const User = require("../../models/User");
const { sendResponse } = require("../../utils/sendResponse");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { sendEmailVerification } = require("../AuthController");

const getUsers = async (req, res) => {
    try {
        // Add pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().select('-password')  // Exclude password field
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
        return sendResponse(res, 500, null, 'Failed to fetch users');
    }
};

const createUser = async (req, res) => {
    try {

        console.log('hdhhdhdhdhd');
        const { fullName, email, password, phoneNumber, address } = req.body;

        // Check if user already exists (case-insensitive)
        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return sendResponse(res, 409, null, 'Email already registered');
        }

        // Hash the password
        const hashedPassword = password;

        // Create user with sanitized data
        const newUser = await User.create({
            fullName: fullName.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            phoneNumber: phoneNumber.replace(/\s+/g, ''),  // Remove any whitespace
            address: address.trim()
        });

        // Remove password from response and convert to plain object
        const userResponse = newUser.toObject();
        delete userResponse.password;

        // Send email verification (assuming it sends an email to the user)
        sendEmailVerification(req, res); 

        // return sendResponse(res, 201, userResponse, 'User created successfully');
    } catch (error) {
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
        const userId = req.params.id;
        const { fullName, email, password, phoneNumber, address } = req.body;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return sendResponse(res, 404, null, 'User not found');
        }

        // Check if the email is being updated and if it already exists for another user
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return sendResponse(res, 409, null, 'Email already registered by another user');
            }
        }

        // Update fields, hash password if it’s being updated
        if (password) {
            user.password =password;
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
        return sendResponse(res, 500, null, 'Failed to update user');
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return sendResponse(res, 404, null, 'User not found');
        }

        return sendResponse(res, 200, null, 'User deleted successfully');
    } catch (error) {
        return sendResponse(res, 500, null, 'Failed to delete user');
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
