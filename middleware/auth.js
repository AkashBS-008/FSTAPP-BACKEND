const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Check for token in different places
        const authHeader = req.header('Authorization');
        const token = authHeader ? authHeader.replace('Bearer ', '') : null;
        
        console.log('Received token:', token); // For debugging
        
        if (!token) {
            console.log('No token provided'); // For debugging
            return res.status(401).json({ 
                status: 'error',
                message: 'No authentication token, access denied' 
            });
        }

        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('Token verified:', verified); // For debugging
        
        req.user = verified;
        next();
    } catch (err) {
        console.error('Auth Error:', err); // For debugging
        res.status(401).json({ 
            status: 'error',
            message: 'Token verification failed, authorization denied',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
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