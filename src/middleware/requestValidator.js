const inputValidate = require('../validation/inputValidate');

async function validateRequest(req, res, next) {
    let reqValidation;
    switch (req.path) {
        case "/api/auth/register-client":
            reqValidation = await inputValidate(
                req.body,
                ['fullName', 'email', 'password', 'phoneNumber', 'address']
            );
            break;
        case "/api/auth/send-email-verification":
            reqValidation = await inputValidate(req.body, ['email']);
            break;
        case "/api/auth/login":
            if (!req.body.email || !req.body.password) {
                reqValidation = {isValid: false, msg: 'Email and password are required'};
            } else {
                reqValidation = {isValid: true};
            }
            break;
        case "/api/auth/send-otp":
            reqValidation = await inputValidate(req.body, ['email']);
            break;
        case "/api/auth/verify-otp":
            reqValidation = await inputValidate(req.body, ['otp']);
            break;
        default:
            reqValidation = {isValid: true};
    }
    if (!reqValidation.isValid) return res.status(400).json({message: reqValidation.msg});
    next();
}

module.exports = validateRequest;