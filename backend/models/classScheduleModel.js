const mongoose = require('mongoose');
const Subject = require('./subjectModel');

const classScheduleSchema = new mongoose.Schema({
    classShift: {
        type: Number,
        required: [true, 'A class schedule must have a class shift.'],
        validate: {
            validator: async function (classShift) {
                return classShift >= 1 && classShift <= 5;
            },
            message: 'Invalid class shift.',
        },
    },
    subjectId: {
        type: String,
        required: [true, 'A class schedule must have a subject id.'],
        trim: true,
        validate: {
            validator: async function (subjectId) {
                const exists = await Subject.exists(subjectId);
                return exists;
            },
            message: 'Invalid subject ID.',
        },
    },
});

const ClassSchedule = mongoose.model('ClassSchedule', classScheduleSchema);

module.exports = ClassSchedule;
