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
        default:
            reqValidation = {isValid: true};
    }
    if (!reqValidation.isValid) return res.status(400).json({message: reqValidation.msg});
    next();
}

module.exports = validateRequest;