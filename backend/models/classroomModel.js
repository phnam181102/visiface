const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'A classroom must have a classroom ID.'],
        unique: true,
        validate: {
            validator: function (classroomId) {
                return /^\d{3}$/.test(classroomId);
            },
            message: 'Classroom ID must be a 3-digit number.',
        },
    },
    name: {
        type: String,
        required: [true, 'A classroom must have a name.'],
        unique: true,
        trim: true,
        maxLength: [
            12,
            'Classroom name must have less or equal then 40 characters',
        ],
        minLength: [8, 'Classroom name must have at least 8 characters'],
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'disabled'],
        default: 'active',
    },
});

classroomSchema.statics.exists = async function (classroomId) {
    const count = await this.countDocuments({ id: classroomId });
    return count > 0;
};

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
