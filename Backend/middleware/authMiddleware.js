const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization); // Debugging

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("Decoded Token:", decoded); // Debugging
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid token." });
    }
};
