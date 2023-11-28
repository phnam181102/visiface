const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createSendToken = (res, statusCode, user) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
    });
};

const filterObj = (obj, ...allowedField) => {
    const newObj = {};

    Object.keys(obj).forEach((key) => {
        if (allowedField.includes(key)) newObj[key] = obj[key];
    });

    return newObj;
};

exports.signup = catchAsync(async (req, res, next) => {
    //Not use User.create(req.body} because everyone can register as an admin (ex: role = 1)
    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm,
    // });

    const filteredBody = filterObj(
        req.body,
        'name',
        'teacherId',
        'email',
        'phoneNumber',
        'photo',
        'birthday',
        'gender',
        'password',
        'passwordConfirm',
    );

    const newUser = await User.create(filteredBody);

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        user: newUser,
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists && password is correct
    // Password default is hidden in userModel, "select('+password')" to get password.
    const user = await User.findOne({ email }).select('+password');

    // correctPassword built in userModel
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        user,
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access.',
                401,
            ),
        );
    }

    // 2) Verification token
    // Use "promisify" to convert the callback-style "jwt.verify" function into a Promise
    // Throws an error if it fails
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(
            new AppError(
                'The token belonging to this token does no longer exist.',
                401,
            ),
        );
    }

    // 4) Check if user changed password after the token was created
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'You recently changed your password! Please log in again.',
            ),
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser; // 💻 Use for "restrictTo" below 🔽
    next();
});

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        // EX: roles=['admin', 'lead-guide'] role='user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action!',
                    403,
                ),
            );
        }

        next();
    };

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError(`There is no user with email address.`, 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();

    // Save to update passwordResetToken and passwordResetExpires in "createPasswordResetToken" to DB
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host',
    )}/api/v1/user/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token send to email!',
        });
    } catch {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('There was an error sending email. Try again later!'),
            500,
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    // Find user has reset token = hashedToken and has not expired
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and user exists, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired.', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); // Save to update data to DB

    // 3) Update changePasswordAt property for the user
    // Build by userSchema.pre('save', fn) in userModel

    // 4) Log the user in, send JWT
    createSendToken(res, 200, user);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    if (req.body.passwordCurrent === req.body.password) {
        return next(
            new AppError(
                'Your new password cannot be the same as your current password.',
                400,
            ),
        );
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    // Get the user again so the password is not in the returned data
    const newUser = await User.findById(req.user.id);

    // 4) Log user in, send JWT
    const token = signToken(user._id);

    res.status(201).json({
        status: 'success',
        data: {
            token,
            user: newUser,
        },
    });
});

exports.checkAuth = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Unauthorized', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new AppError('Unauthorized', 401));
    }

    res.status(200).json({
        status: 'success',
        data: {
            session: {
                token,
                user,
            },
        },
    });
});
