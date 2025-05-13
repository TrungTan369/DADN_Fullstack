const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (token, secretKey) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        console.log("JWT Verification Error: ", error); // In lỗi JWT
        return null; // Trả về null nếu token không hợp lệ hoặc hết hạn
    }
};

const authenticateMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'User is not authenticated'
        });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token, process.env.JWT_SECRET);
    if (!payload) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
    req.user = payload;
    next();
};
module.exports = {
    authenticateMiddleware,
    verifyToken
}