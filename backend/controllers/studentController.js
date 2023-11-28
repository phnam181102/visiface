const Student = require('../models/studentModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.updateStudentTrainingStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const student = await Student.findOne({ id });

    if (!student) {
        return next(new AppError('No student found with that ID.', 404));
    }

    student.trained = true;
    await student.save();

    res.status(200).json({
        status: 'success',
        data: {
            student,
        },
    });
});

exports.getAllStudents = catchAsync(async (req, res, next) => {
    // 💻 EXECUTE QUERY
    const features = new APIFeatures(Student.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const students = await features.query;

    // 💻 SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: students.length,
        requestedAt: req.requestTime /* From custom middleware */,
        data: {
            students,
        },
    });
});

exports.getStudent = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(
        Student.findById(req.params.id),
        // Same: Student.findOne({ _id: req.params.id })
        req.query,
    ).limitFields();
    const student = await features.query;

    if (!student) {
        return next(new AppError('No student found with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            student,
        },
    });
});

exports.createStudent = catchAsync(async (req, res, next) => {
    const newStudent = await Student.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            student: newStudent,
        },
    });
});

exports.updateStudent = catchAsync(async (req, res, next) => {
    const updatedStudent = await Student.findOneAndUpdate(
        { id: req.params.id },
        { ...req.body },
        {
            new: true,
            runValidators: true,
        },
    );

    if (!updatedStudent) {
        return next(new AppError('No student found with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            student: updatedStudent,
        },
    });
});

exports.deleteStudent = catchAsync(async (req, res, next) => {
    const student = await Student.findOneAndDelete({ id: req.params.id });

    if (!student) {
        return next(new AppError('No student found with that ID.', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
