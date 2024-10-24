function auth(roles = []) {
    return (req, res, next) => {
        if (roles.includes(req.decoded.role)) next();
        else res.status(403).json({error: 'Unauthorized'});
    }
}

module.exports = auth;