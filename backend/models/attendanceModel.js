const mongoose = require('mongoose');
const Student = require('./studentModel');
const Subject = require('./subjectModel');

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: [
            true,
            'An attendance record must be associated with a student.',
        ],
        validate: {
            validator: async function (studentId) {
                const exists = await Student.exists(studentId);
                return exists;
            },
            message: 'Invalid student ID.',
        },
    },
    subjectId: {
        type: String,
        required: [
            true,
            'An attendance record must be associated with a subject.',
        ],
        validate: {
            validator: async function (subjectId) {
                const exists = await Subject.exists(subjectId);
                return exists;
            },
            message: 'Invalid subject ID.',
        },
    },
    date: {
        type: Date,
        required: [true, 'Attendance date is required.'],
    },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
