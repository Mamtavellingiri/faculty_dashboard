const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    const token = bearerHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Malformed token.' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fapd_super_secret_key_2024', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized! Invalid token.' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Require Admin Role!' });
    }
    next();
};

const isFaculty = (req, res, next) => {
    if (req.userRole !== 'faculty') {
        return res.status(403).json({ message: 'Require Faculty Role!' });
    }
    next();
};

module.exports = {
    verifyToken,
    isAdmin,
    isFaculty
};
