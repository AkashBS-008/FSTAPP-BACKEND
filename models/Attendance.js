const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);