const _ = require('lodash');
const User = require('../models/User');
const sendEmailVerification = require('../utils/sendEmailVerification');

async function registerUser(userData, userRole) {
    // Check for unique email
    const emailExists = await User.findOne({ email: userData.email });
    if (emailExists) throw new Error('Email already exists');

    // Create new user
    const user = await User.create({
        ..._.pick(userData, ['fullName', 'email', 'password', 'phoneNumber', 'address']),
        role: userRole
    });

    // Send email verification
    const emailSent = await sendEmailVerification(user._id, user.email);
    
    if (emailSent.error) throw new Error(emailSent.error);

    return user;
}

module.exports = {
    registerUser
};
