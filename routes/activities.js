const router = require('express').Router();
const Activity = require('../models/Activity');
const { auth, adminAuth } = require('../middleware/auth');

// Get all activities
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find().sort({ date: -1 });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new activity (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const activity = new Activity(req.body);
        await activity.save();
        res.status(201).json(activity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update activity (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        Object.assign(activity, req.body);
        await activity.save();
        res.json(activity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete activity (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json({ message: 'Activity deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;