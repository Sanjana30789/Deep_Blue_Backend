const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization"); // Get Authorization header

    if (!authHeader) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_fallback_secret");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
