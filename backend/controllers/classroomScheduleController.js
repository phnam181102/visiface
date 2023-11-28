const ClassroomSchedule = require('../models/classroomScheduleModel');
const Classroom = require('../models/classroomModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const ClassModel = require('../models/classModel');

exports.createClassroomSchedule = catchAsync(async (req, res, next) => {
    const { id, weeklySchedule, classId } = req.body;

    if (!id) return next(new AppError('A subject must have a class ID.', 400));

    // Check classId
    const classObj = await ClassModel.findOne({
        id: classId,
    });
    if (!classObj) return next(new AppError('Invalid class ID.', 400));

    Object.keys(weeklySchedule).forEach(async (day) => {
        const shifts = weeklySchedule[day];

        shifts.forEach(async (shift) => {
            const classroom = await Classroom.findOne({
                id: shift.classroomId,
            });

            if (!classroom) {
                return next(new AppError('Invalid classroom ID.', 400));
            }

            if (shift.classShift < 1 || shift.classShift > 5) {
                return next(new AppError('Invalid class shift.', 400));
            }

            const classroomScheduleData = {
                classroomId: shift.classroomId,
                weeklySchedule: {
                    [day]: [
                        {
                            classShift: shift.classShift,
                            subjectId: id,
                            classId,
                        },
                    ],
                },
            };

            ClassroomSchedule.create(classroomScheduleData);
        });
    });

    next();
});

exports.getAllClassroomSchedules = catchAsync(async (req, res, next) => {
    // 💻 EXECUTE QUERY
    /* 
        Mặc dù trong filter đã có .find() để trong trường hợp khi không xâu chuỗi .filter() vào thì vẫn có thể chạy bình thường hoặc để có thể định dạng được đang dùng find trong phần tourSchema.pre ở tourModel.
        Việc xâu chuỗi Class.find().find() không ảnh hưởng gì cả
        */
    const features = new APIFeatures(ClassroomSchedule.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const classroomSchedule = await features.query;

    // 💻 SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: classroomSchedule.length,
        requestedAt: req.requestTime /* From custom middleware */,
        data: {
            classroomSchedule,
        },
    });
});

exports.getClassroomScheduleByWeekday = catchAsync(async (req, res, next) => {
    const { classroomId, weekday } = req.params;

    const classroomSchedule = await ClassroomSchedule.findOne({ classroomId });

    if (!classroomSchedule) {
        return next(
            new AppError('No classroom schedule found with that ID.', 404),
        );
    }

    res.status(200).json({
        status: 'success',
        data: {
            [weekday]: classroomSchedule.weeklySchedule[weekday],
        },
    });
});

exports.updateClassroomSchedule = catchAsync(async (req, res, next) => {
    const updatedClassroomSchedule = await ClassroomSchedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        },
    );

    if (!updatedClassroomSchedule) {
        return next(
            new AppError('No classroom schedule found with that ID.', 404),
        );
    }

    res.status(200).json({
        status: 'success',
        data: {
            class: updatedClassroomSchedule,
        },
    });
});

exports.deleteClassroomSchedule = catchAsync(async (req, res, next) => {
    const deletedClassroomSchedule = await ClassroomSchedule.findByIdAndDelete(
        req.params.id,
    );

    if (!deletedClassroomSchedule) {
        return next(
            new AppError('No classroom schedule found with that ID.', 404),
        );
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
