const inputValidate = require('../validation/inputValidate');

function validateRequest(fields) {
    return async (req, res, next) => {
        // console.log(req.body)
        const reqValidation = await inputValidate(req.body, fields);
        if (!reqValidation.isValid) return res.status(400).json({message: reqValidation.msg});
        next();
    }
}

module.exports = validateRequest;   