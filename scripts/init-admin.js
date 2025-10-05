const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const initAdmin = async () => {
    try {
        await mongoose.connect('mongodb+srv://nss:nss@cluster0.tp1c0.mongodb.net/p1?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@tce.edu' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = new User({
            name: 'Admin',
            email: 'admin@tce.edu',
            password: hashedPassword,
            role: 'admin',
            phone: '1234567890'
        });

        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

initAdmin();