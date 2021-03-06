const jwt = require('jsonwebtoken');
const privateKey = 'dinner';
const refreshKey = 'refresh';
const authMiddleware = (req, res, next) => {
    const token = req.headers['accesstoken'] || req.query.token;
    console.log("ok token");
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        });
    }
    const p = new Promise((resolve, reject) => {
        jwt.verify(token, privateKey, (err, decoded) => {
            if (err)
                reject(err);
            resolve(decoded);
        });
    });
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        });
    };
    p.then((decoded) => {
        req.decoded = decoded;
        next();
    }).catch(onError);
};
module.exports = authMiddleware;
//# sourceMappingURL=auth.js.map