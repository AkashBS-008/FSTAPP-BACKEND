const mongoose = require('mongoose');

const bloodRequirementSchema = new mongoose.Schema({
    recipientName: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    unitsNeeded: {
        type: Number,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        enum: ['urgent', 'normal'],
        default: 'normal'
    },
    status: {
        type: String,
        enum: ['active', 'fulfilled', 'closed'],
        default: 'active'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BloodRequirement', bloodRequirementSchema);