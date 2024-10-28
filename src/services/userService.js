const _ = require('lodash');
const User = require('../models/User');

async function registerUser(userData, userRole) {
    try {
        // Check for unique email
        const emailExists = await User.findOne({ email: userData.email });
        if (emailExists) return {success: false, error: 'Email already exists'};

        // Create new user
        const user = await User.create({
            ..._.pick(userData, ['fullName', 'email', 'password', 'phoneNumber', 'address']),
            role: userRole
        });

        return {success: true, user};
    } catch (error) {
        return {success: false, error: error.message};
    }
}

module.exports = {
    registerUser
};
