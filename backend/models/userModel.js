const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name.'],
        trim: true,
    },
    teacherId: {
        type: String,
        // required: [true, 'A user must have a teacherId.'],
        trim: true,
        validate: {
            validator: function (subjectId) {
                return /^[a-zA-Z0-9]{5}$/.test(subjectId);
            },
            message:
                'Teacher ID must be a 5-character string consisting of letters and numbers.',
        },
    },
    email: {
        type: String,
        required: [true, 'A user must have an email.'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'A user must have a phone number.'],
        trim: true,
        validate: {
            validator: function getString(str) {
                return validator.isMobilePhone(str, 'vi-VN');
            },
            message: 'Please provide a valid phone number.',
        },
    },
    photo: String,
    birthday: Date,
    gender: {
        type: Number,
        enum: [0, 1],
    },
    role: {
        type: String,
        enum: ['teacher', 'manager', 'admin'],
        default: 'teacher',
    },
    status: {
        type: String,
        enum: ['active', 'disabled', 'banned'],
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minLength: [8, 'Password must have at least 8 characters.'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            // This only works on CREATE and SAVE
            validator: function (el) {
                return el === this.password; // el => Get passwordConfirm value
            },
            message: 'Passwords are not the same.',
        },
        select: false,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,

    passwordChangedAt: Date,
});

// Hash the password and delete passwordConfirm before save "user"
userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Requires input but doesn't require writing to DB so we can delete it this way
    this.passwordConfirm = undefined;

    next();
});

// Update changePasswordAt before save "user"
userSchema.pre('save', function (next) {
    // Check if the password has been modified or not or if the user is newly created
    if (!this.isModified('password') || this.isNew) return next();

    // NOTE: Error if the time the "token" was created is earlier than "passwordChangedAt" => -1 second
    this.passwordChangedAt = Date.now() - 1000;

    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    // Random a string provided to users to reset password
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Encode the token to save in the database
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
