const path = require('path');
const User = require('../models/User');
const getRedisClient = require('../config/redis');
const sendOTPMail = require('../utils/sendOTPMail');
const jwtService = require('../services/jwtService');
const mailService = require('../services/mailService');
const sendAuthTokens = require('../utils/sendAuthTokens');
const { registerUser } = require('../services/userService');
const SecurityManager = require('../utils/SecurityManager');
const sendEmailVerification = require('../utils/sendEmailVerification');

class AuthController {
    async registerClient(req, res) {
        try {
            await registerUser(req.body, 'client');
            res.status(201).json({ message: 'User created successfully. Check your email for verification' });
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

    async verifyEmail(req, res) {
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
            if (!req.body.email || !req.body.password)
                return res.status(400).json({message: 'Email and password are required'});

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

            return await sendAuthTokens(res, {id: user._id, role: user.role});

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
            return sendAuthTokens(res, {id: user._id, role: user.role});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async refreshToken(req, res) {
        try {
            const accessToken = jwtService.generateToken(req.decoded.id, 30 * 60);
            res.status(200).json({accessToken});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('refreshToken');
            res.status(200).json({message: 'Logout successful'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async forgotPassword(req, res) {
        try {
            const user = await User.findOne({email: req.body.email});
            if (!user) return res.status(404).json({message: 'User not found'});

            const token = jwtService.generateToken(user._id, 600);
            const emailSent = await mailService.send(
                user.email,
                'Reset Password',
                path.join(__dirname, '../views/mail/reset-password.ejs'),
                {link: `${process.env.FRONT_APP_HOST}/reset-password?token=${token}`}
            );
            if (emailSent.error) return res.status(500).json({error: emailSent.error});
            res.status(200).json({message: 'Reset password link sent successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async verifyResetPassword(req, res) {
        try {
            const decoded = req.decoded;
            const user = await User.findById(decoded.id);
            if (!user) return res.status(404).json({message: 'User not found'});
            const token = jwtService.generateToken(user._id, 300);
            res.status(200).json({token});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async resetPassword(req, res) {
        try {
            const decoded = req.decoded;
            const user = await User.findById(decoded.id);
            if (!user) return res.status(404).json({message: 'User not found'});
            user.password = req.body.password;
            await user.save();
            res.status(200).json({message: 'Password reset successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = new AuthController();