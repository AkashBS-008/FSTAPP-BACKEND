const router = require('express').Router();
const Attendance = require('../models/Attendance');
const { auth, adminAuth } = require('../middleware/auth');

// Get all attendance records
router.get('/', auth, async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate('userId', 'name')
            .populate('activityId', 'title date')
            .sort({ date: -1 });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark attendance (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const { activityId, records } = req.body;
        if (!activityId || !records || !Array.isArray(records)) {
            return res.status(400).json({ message: 'Invalid request format' });
        }

        // Delete existing attendance records for this activity
        await Attendance.deleteMany({ activityId });

        // Create new attendance records
        const attendanceRecords = records.map(record => ({
            activityId,
            userId: record.userId,
            status: record.status
        }));

        const saved = await Attendance.insertMany(attendanceRecords);
        const populated = await Attendance.find({ activityId })
            .populate('userId', 'name')
            .populate('activityId', 'title date');

        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update attendance (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        Object.assign(attendance, req.body);
        await attendance.save();
        res.json(attendance);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get attendance by activity
router.get('/activity/:activityId', auth, async (req, res) => {
    try {
        const attendance = await Attendance.find({ activityId: req.params.activityId })
            .populate('userId', 'name')
            .populate('activityId', 'title date');
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user attendance history
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const attendance = await Attendance.find({ userId: req.params.userId })
            .populate('activityId', 'title date')
            .sort({ date: -1 });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;