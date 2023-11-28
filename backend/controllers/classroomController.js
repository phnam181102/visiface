const Classroom = require('../models/classroomModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllClassrooms = catchAsync(async (req, res, next) => {
    // 💻 EXECUTE QUERY
    const features = new APIFeatures(Classroom.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const classroom = await features.query;

    // 💻 SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: classroom.length,
        requestedAt: req.requestTime /* From custom middleware */,
        data: {
            classroom,
        },
    });
});

exports.getClassroom = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(
        Classroom.findById(req.params.id),
        // Same: Classroom.findOne({ _id: req.params.id })
        req.query,
    ).limitFields();
    const result = await features.query;

    if (!result) {
        return next(new AppError('No classroom found with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            classroom: result,
        },
    });
});

exports.createClassroom = catchAsync(async (req, res, next) => {
    const newClassroom = await Classroom.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            classroom: newClassroom,
        },
    });
});

exports.updateClassroom = catchAsync(async (req, res, next) => {
    const updatedClassroom = await Classroom.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        },
    );

    if (!updatedClassroom) {
        return next(new AppError('No classroom found with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            classroom: updatedClassroom,
        },
    });
});

exports.deleteClassroom = catchAsync(async (req, res, next) => {
    const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);

    if (!deletedClassroom) {
        return next(new AppError('No classroom found with that ID.', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
