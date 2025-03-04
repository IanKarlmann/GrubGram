const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");

    console.log("Auth Header Received:", authHeader);

    if (!authHeader) {
        console.error("No Auth Header Provided");
        return res.status(401).json({ message: "Access Denied" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    if (!token) {
        console.error("Token Not Found in Header");
        return res.status(401).json({ message: "Token not provided" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token Verified Successfully:", verified);
        req.user = verified;
        next();
    } catch (error) {
        console.error("JWT Verification Failed:", error.message);
        return res.status(403).json({ message: "Invalid Token" });
    }
};

module.exports = { authenticateToken };