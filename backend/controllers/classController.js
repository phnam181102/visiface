const Class = require('../models/classModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllClasses = catchAsync(async (req, res, next) => {
    // 💻 EXECUTE QUERY
    /* 
        Mặc dù trong filter đã có .find() để trong trường hợp khi không xâu chuỗi .filter() vào thì vẫn có thể chạy bình thường hoặc để có thể định dạng được đang dùng find trong phần tourSchema.pre ở tourModel.
        Việc xâu chuỗi Class.find().find() không ảnh hưởng gì cả
        */
    const features = new APIFeatures(Class.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const classes = await features.query;

    // 💻 SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: classes.length,
        requestedAt: req.requestTime /* From custom middleware */,
        data: {
            classes,
        },
    });
});

exports.getClass = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(
        Class.findById(req.params.id),
        // Same: Class.findOne({ _id: req.params.id })
        req.query,
    ).limitFields();
    const result = await features.query;

    if (!result) {
        return next(new AppError('No class found with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            class: result,
        },
    });
});

exports.createClass = catchAsync(async (req, res, next) => {
    const newClass = await Class.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            class: newClass,
        },
    });
});

exports.updateClass = catchAsync(async (req, res, next) => {
    const updatedClass = await Class.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        },
    );

    if (!updatedClass) {
        return next(new AppError('No class found with that ID.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            class: updatedClass,
        },
    });
});

exports.deleteClass = catchAsync(async (req, res, next) => {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);

    if (!deletedClass) {
        return next(new AppError('No class found with that ID.', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
