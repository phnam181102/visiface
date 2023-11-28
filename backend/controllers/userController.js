const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const filterObj = (obj, ...allowedField) => {
    const newObj = {};

    Object.keys(obj).forEach((key) => {
        if (allowedField.includes(key)) newObj[key] = obj[key];
    });

    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
    const features = new APIFeatures(User.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const users = await features.query;

    const count = await User.countDocuments();

    // 💻 SEND RESPONSE
    res.status(200).json({
        status: 'success',
        count,
        results: users.length,
        requestedAt: req.requestTime /* From custom middleware */,
        data: {
            users,
        },
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword',
                400,
            ),
        );
    }

    // 2) Filtered out unwanted fields name that are not allowed to be updated
    const filteredBody = filterObj(
        req.body,
        'name',
        'email',
        'teacherId',
        'phoneNumber',
        'birthday',
        'gender',
        'photo',
    );

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true, // Return new user after update
            runValidators: true,
        },
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

exports.updateUser = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(
        req.body,
        'name',
        'email',
        'teacherId',
        'phoneNumber',
        'birthday',
        'gender',
        'photo',
    );

    const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return next(new AppError('No user found with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID.', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
