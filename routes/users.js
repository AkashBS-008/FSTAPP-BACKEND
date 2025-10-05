const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// Get all volunteers (admin only)
router.get('/volunteers', auth, adminAuth, async (req, res) => {
    try {
        const volunteers = await User.find({ role: 'volunteer' }).select('-password');
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new volunteer (admin only)
router.post('/register', auth, adminAuth, async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new volunteer
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'volunteer',
            phone
        });

        await user.save();
        
        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json(userResponse);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update volunteer (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        
        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;
        res.json(userResponse);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete volunteer (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin user' });
        }

        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;