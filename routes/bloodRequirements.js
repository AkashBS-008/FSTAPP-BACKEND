const router = require('express').Router();
const BloodRequirement = require('../models/BloodRequirement');
const { auth, adminAuth } = require('../middleware/auth');

// Get all blood requirements
router.get('/', async (req, res) => {
    try {
        const requirements = await BloodRequirement.find()
            .populate('postedBy', 'name')
            .sort({ createdAt: -1 });
        res.json(requirements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create blood requirement
router.post('/', auth, async (req, res) => {
    try {
        console.log('Creating blood requirement:', req.body);
        const requirement = new BloodRequirement({
            ...req.body,
            postedBy: req.user.id
        });
        await requirement.save();
        console.log('Blood requirement saved:', requirement);
        const populatedRequirement = await requirement.populate('postedBy', 'name');
        res.status(201).json(populatedRequirement);
    } catch (err) {
        console.error('Error creating blood requirement:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update blood requirement status (admin only)
router.put('/:id/status', auth, adminAuth, async (req, res) => {
    try {
        const requirement = await BloodRequirement.findById(req.params.id);
        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }
        requirement.status = req.body.status;
        await requirement.save();
        res.json(requirement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete blood requirement (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const requirement = await BloodRequirement.findByIdAndDelete(req.params.id);
        if (!requirement) {
            return res.status(404).json({ message: 'Requirement not found' });
        }
        res.json({ message: 'Requirement deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;