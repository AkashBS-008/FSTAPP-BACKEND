const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
};

const adminAuth = (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { auth, adminAuth };