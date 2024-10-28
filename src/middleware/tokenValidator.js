const jwtService = require("../services/jwtService");

function validate(method) {
    return (req, res, next) => {
        try {
            let token = '';
            if (method === 'query') token = req.query.token;
            if (method === 'params') token = req.params.token;
            if (method === 'cookies' && req.cookies.refreshToken) token = req.cookies.refreshToken;
            if (method === 'headers' && req.headers.authorization) token = req.headers.authorization.split(' ')[1];
            req.decoded = jwtService.verifyToken(token);
            next();
        } catch (error) {
            res.status(401).json({error: 'Unauthorized'});
        }
    }
}

module.exports = {
    validateQuery: validate('query'),
    validateParams: validate('params'),
    validateRefreshToken: validate('cookies'),
    validateAccessToken: validate('headers'),
};