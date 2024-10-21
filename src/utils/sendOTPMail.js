const path = require('path');
const getRedisClient = require("../config/redis");
const mailService = require("../services/mailService");

module.exports = async (user) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const redis = await getRedisClient();
    await redis.set(otp, user._id.toString(), 'EX', 60 * 5); // 5 minutes

    return await mailService.send(
        user.email,
        'OTP Verification',
        path.join(__dirname, '../views/mail/verify-otp.ejs'),
        {otp}
    );
}
