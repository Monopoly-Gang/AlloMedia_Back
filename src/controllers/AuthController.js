const _ = require('lodash');
const User = require('../models/User');
const sendOTPMail = require('../utils/sendOTPMail');
const getRedisClient = require('../config/redis');
const sendAuthTokens = require('../utils/sendAuthTokens');
const SecurityManager = require('../utils/SecurityManager');
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

    async sendEmailVerification(req, res) {
        try {
            const user = await User.findOne({email: req.body.email});
            if (!user) return res.status(404).json({message: 'User not found'});
            const emailSent = await sendEmailVerification(user._id, user.email);
            if (emailSent.error) return res.status(500).json({message: emailSent.error});
            res.status(200).json({message: 'Email verification sent successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async verifyEmail (req, res) {
        try {
            const decoded = req.decoded;

            // Update user status
            const user = await User.findByIdAndUpdate(decoded.id, {isVerified: true}, {new: true});
            if (!user) return res.status(404).json({message: 'User not found'});
            res.status(200).json({message: 'Email verified successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async login(req, res) {
        try {
            // Check if user exists
            const user = await User.findOne({email: req.body.email});
            if (!user) return res.status(404).json({message: 'email not found'});

            // Check if password is correct
            const validPassword = await user.comparePassword(req.body.password);
            if (!validPassword) return res.status(400).json({message: 'Invalid password'});

            // Check if user is verified
            if (!user.isVerified) {
                const emailSent = await sendEmailVerification(user._id, user.email);
                if (emailSent.error) return res.status(500).json({error: emailSent.error});
                return res.status(401).json({message: 'Email not verified. Check your email for verification'});
            }

            // Check user fingerprint
            if (await SecurityManager.isNewDeviceOrLocation(user.id, req)) {
                const otpSent = await sendOTPMail(user);
                if (otpSent.error) return res.status(500).json({error: otpSent.error});
                return res.status(401).json({message: 'New device or location detected. Check your email for OTP verification'});
            }

            return await sendAuthTokens(res, {id: user._id});

        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async sendOtp(req, res) {
        try {
            const user = await User.findOne({email: req.body.email});
            if (!user) return res.status(404).json({message: 'User not found'});
            const otpSent = await sendOTPMail(user);
            if (otpSent.error) return res.status(500).json({error: otpSent.error});
            res.status(200).json({message: 'OTP sent successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async verifyOtp(req, res) {
        try {
            const redis = await getRedisClient();
            const userId = await redis.get(req.body.otp);
            if (!userId) return res.status(400).json({error: 'Invalid or expired OTP'});
            const user = await User.findById(userId);
            await redis.del(req.body.otp);
            await SecurityManager.updateLoginHistory(userId, req);
            return sendAuthTokens(res, {id: user._id});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = new AuthController();