const User = require("../../models/User");
const { sendResponse } = require("../../utils/sendResponse");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { sendEmailVerification } = require("../AuthController");
const { registerUser } = require("../../services/userService");

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



const createUser=async(req, res) => {
    try {
        await registerUser(req.body, 'livreur');
        res.status(201).json({ message: 'User created successfully. Check your email for verification' });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

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
