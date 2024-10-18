const _ = require('lodash');
const User = require('../models/User');
const sendEmailVerification = require('../utils/sendEmailVerification');

class AuthController {
    async registerClient(req, res) {
        try {
            // Check for unique email
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) return res.status(400).json({message: 'Email already exists'});

            // Create new user
            const user = await User.create(_.pick(
                req.body,
                ['fullName', 'email', 'password', 'phoneNumber', 'address']
            ));

            // Send email verification
            const emailSent = await sendEmailVerification(user._id, user.email);
            if (emailSent.error) return res.status(500).json({message: emailSent.error});
            res.status(201).json({message: 'User created successfully. Check your email for verification'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = new AuthController();