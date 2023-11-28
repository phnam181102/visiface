const Subject = require('../models/subjectModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTeacherSubjects = catchAsync(async (req, res) => {
    const { teacherId } = req.params;

    const pipeline = [
        {
            $match: {
                teacherId: teacherId,
            },
        },
        {
            $project: {
                _id: 0, // Loại bỏ trường _id
                id: 1,
                name: 1,
                credit: 1,
                classId: 1,
                slug: 1,
            },
        },
    ];

    // Sử dụng pipeline để truy vấn trong MongoDB
    const result = await Subject.aggregate(pipeline);

    res.status(200).json({
        status: 'success',
        data: {
            subjects: result,
        },
    });
});

exports.getAllSubjects = catchAsync(async (req, res, next) => {
    // 💻 EXECUTE QUERY
    const features = new APIFeatures(Subject.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const subject = await features.query;

    // 💻 SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: subject.length,
        requestedAt: req.requestTime /* From custom middleware */,
        data: {
            subject,
        },
    });
});

exports.getSubject = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(
        Subject.findById(req.params.id),
        // Same: Subject.findOne({ _id: req.params.id })
        req.query,
    ).limitFields();
    const result = await features.query;

    if (!result) {
        return next(new AppError('No subject found with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            subject: result,
        },
    });
});

exports.createSubject = catchAsync(async (req, res, next) => {
    const newSubject = await Subject.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            subject: newSubject,
        },
    });
});

exports.updateSubject = catchAsync(async (req, res, next) => {
    const updatedSubject = await Subject.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        },
    );

    if (!updatedSubject) {
        return next(new AppError('No subject found with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            subject: updatedSubject,
        },
    });
});

exports.deleteSubject = catchAsync(async (req, res, next) => {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

    if (!deletedSubject) {
        return next(new AppError('No subject found with that ID.', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
