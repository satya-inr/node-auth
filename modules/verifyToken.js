const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(400).send('Access Denied');

    try {
        const verify = jwt.verify(token, process.env.TOKEN_SECREAT);
        req.user = verify;
        next();
    } catch (error) {
        return res.status(400).send('Invalid Token');
    }
}

