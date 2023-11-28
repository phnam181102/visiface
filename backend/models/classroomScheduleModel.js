const mongoose = require('mongoose');
const ClassroomModel = require('./classroomModel');

const validateShift = (shift) =>
    shift &&
    typeof shift.classShift === 'number' &&
    shift.classShift >= 1 &&
    shift.classShift <= 5 &&
    shift.subjectId &&
    typeof shift.subjectId === 'string';

const validateWeeklySchedule = function (weeklySchedule) {
    const validDays = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];

    const days = Object.keys(weeklySchedule);
    const areDaysValid = days.every((day) => validDays.includes(day));
    if (!areDaysValid) {
        return false;
    }

    const shifts = days.flatMap((day) => weeklySchedule[day]);
    const areShiftsValid = shifts.every(validateShift);

    if (!areShiftsValid) {
        return false;
    }

    return true;
};

const classroomScheduleSchema = new mongoose.Schema({
    classroomId: {
        type: String,
        required: [true, 'A classroom must have a classroom ID.'],
        trim: true,
        validate: {
            validator: async function (classroomId) {
                const exists = await ClassroomModel.exists(classroomId);
                return exists;
            },
            message: 'Invalid classroom ID.',
        },
    },
    weeklySchedule: {
        type: {
            monday: [
                {
                    classShift: Number,
                    subjectId: String,
                    classId: String,
                },
            ],
            tuesday: [
                {
                    classShift: Number,
                    subjectId: String,
                    classId: String,
                },
            ],
            wednesday: [
                {
                    classShift: Number,
                    subjectId: String,
                    classId: String,
                },
            ],
            thursday: [
                {
                    classShift: Number,
                    subjectId: String,
                    classId: String,
                },
            ],
            friday: [
                {
                    classShift: Number,
                    subjectId: String,
                    classId: String,
                },
            ],
            saturday: [
                {
                    classShift: Number,
                    subjectId: String,
                    classId: String,
                },
            ],
        },
        required: [true, 'A classroom schedule must have a weekly schedule.'],
        validate: [validateWeeklySchedule, 'Invalid weekly schedule.'],
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'disabled'],
        default: 'active',
    },
});

const ClassroomSchedule = mongoose.model(
    'ClassroomSchedule',
    classroomScheduleSchema,
);

module.exports = ClassroomSchedule;
