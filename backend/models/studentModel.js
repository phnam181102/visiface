const mongoose = require('mongoose');
const validator = require('validator');
const ClassModel = require('./classModel');

const studentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'A student must have a student ID.'],
        unique: true,
        validate: {
            validator: function (studentId) {
                return /^\d{5}$/.test(studentId);
            },
            message: 'Student ID must be a 5-digit number.',
        },
    },
    classId: {
        type: String,
        required: [true, 'A student must have a class.'],
        trim: true,
        validate: {
            validator: async function (classId) {
                const exists = await ClassModel.exists(classId);
                return exists;
            },
            message: 'Invalid class ID.',
        },
    },
    fullName: {
        type: String,
        required: [true, 'A student must have a name.'],
        trim: true,
    },
    pinCode: {
        type: String,
        required: [true, 'A student must have a pin code.'],
        validate: {
            validator: function (pinCode) {
                return /^\d{6}$/.test(pinCode);
            },
            message: 'Pin code must be a 6-digit number.',
        },
        default: '123123',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    phoneNumber: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'A student must have a phone number.'],
        validate: {
            validator: function getString(str) {
                return validator.isMobilePhone(str, 'vi-VN');
            },
            message: 'Please provide a valid phone number.',
        },
    },
    birthday: {
        type: Date,
        trim: true,
    },
    photo: String,
    gender: {
        type: Number,
        enum: [0, 1], // 1 = male, 0 = female
    },
    trained: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['active', 'withdrawn', 'expelled'],
        default: 'active',
    },
});

studentSchema.statics.exists = async function (studentId) {
    const count = await this.countDocuments({ id: studentId });
    return count > 0;
};

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
