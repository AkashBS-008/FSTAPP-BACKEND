const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    },
    type: {
        type: String,
        enum: ['classroom', 'special', 'camp'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);