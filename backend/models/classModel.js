const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'A class must have a class ID.'],
        unique: true,
        validate: {
            validator: function (classId) {
                return /^[a-zA-Z0-9]{7}$/.test(classId);
            },
            message:
                'Class ID must be a 5-character string consisting of letters and numbers.',
        },
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'disabled'],
        default: 'active',
    },
});

classSchema.statics.exists = async function (classId) {
    const count = await this.countDocuments({ id: classId });
    return count > 0;
};

const ClassModel = mongoose.model('Class', classSchema);
module.exports = ClassModel;
