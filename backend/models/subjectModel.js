const mongoose = require('mongoose');
const slugify = require('slugify');
const ClassModel = require('./classModel');

const validateShift = (shift) =>
    shift &&
    typeof shift.classShift === 'number' &&
    shift.classShift >= 1 &&
    shift.classShift <= 5 &&
    shift.classroomId &&
    typeof shift.classroomId === 'string';

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

const subjectSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'A subject must have a class ID.'],
        unique: true,
        validate: {
            validator: function (subjectId) {
                return /^[a-zA-Z0-9]{5}$/.test(subjectId);
            },
            message:
                'Subject ID must be a 5-character string consisting of letters and numbers.',
        },
    },
    classId: {
        type: String,
        required: [true, 'A subject must have a class.'],
        trim: true,
        validate: {
            validator: async function (classId) {
                const exists = await ClassModel.exists(classId);
                return exists;
            },
            message: 'Invalid class ID.',
        },
    },
    teacherId: {
        type: String,
        required: [true, 'A subject must have a teacher.'],
        trim: true,
        validate: {
            validator: function (subjectId) {
                return /^[a-zA-Z0-9]{5}$/.test(subjectId);
            },
            message:
                'Teacher ID must be a 5-character string consisting of letters and numbers.',
        },
    },
    name: {
        type: String,
        required: [true, 'A subject must have a name.'],
        unique: true,
        trim: true,
        maxLength: [
            40,
            'Subject name must have less or equal then 40 characters',
        ],
        minLength: [8, 'Subject name must have at least 8 characters'],
    },
    credit: {
        type: Number,
        required: [true, 'A subject must have a credit value.'],
    },
    lessonsPerWeek: {
        type: Number,
    },
    slug: String,
    startDate: {
        type: Date,
        required: [true, 'A subject must have a start date.'],
    },
    endDate: {
        type: Date,
        // required: [true, 'A subject must have a end date.'],
    },
    weeklySchedule: {
        type: {
            monday: [
                {
                    classShift: Number,
                    classroomId: String,
                },
            ],
            tuesday: [
                {
                    classShift: Number,
                    classroomId: String,
                },
            ],
            wednesday: [
                {
                    classShift: Number,
                    classroomId: String,
                },
            ],
            thursday: [
                {
                    classShift: Number,
                    classroomId: String,
                },
            ],
            friday: [
                {
                    classShift: Number,
                    classroomId: String,
                },
            ],
            saturday: [
                {
                    classShift: Number,
                    classroomId: String,
                },
            ],
        },
        required: [true, 'A subject must have a weekly schedule.'],
        validate: [validateWeeklySchedule, 'Invalid weekly schedule.'],
    },
    status: {
        type: String,
        enum: ['active', 'upcoming', 'completed'],
        default: 'active',
    },
});

subjectSchema.pre('save', function (next) {
    const { credit, startDate, weeklySchedule } = this;

    let lessonsPerWeek = 0;

    Object.keys(weeklySchedule).forEach((day) => {
        lessonsPerWeek += weeklySchedule[day].length;
    });

    const totalLessons = (credit * 15) / 3;
    const totalWeeks = Math.ceil(totalLessons / lessonsPerWeek);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + totalWeeks * 7); // 7 days in a week

    this.lessonsPerWeek = lessonsPerWeek;
    this.endDate = endDate;
    this.slug = slugify(this.name, { lower: true });
    next();
});

subjectSchema.statics.exists = async function (subjectId) {
    const count = await this.countDocuments({ id: subjectId });
    return count > 0;
};

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
