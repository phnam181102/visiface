const Attendance = require('../models/attendanceModel');
const catchAsync = require('../utils/catchAsync');

// exports.getAllAttendanceInfoForClass = catchAsync(async (req, res, next) => {
//     const { studentId, subjectId } = req.body;

//     req.query.sort = 'fullName';
//     req.query.fields = 'fullName,id,status';

//     // Get attendances
//     const pipeline = [
//         {
//             $match: {
//                 studentId,
//                 subjectId,
//             },
//         },
//         {
//             $group: {
//                 _id: '$studentId',
//                 totalAttendance: {
//                     $sum: 1,
//                 },
//             },
//         },
//     ];
//     const data = await Attendance.aggregate(pipeline);
//     const attendances = data.totalAttendance;
//     next();
// });

exports.getAttendanceSummaryForStudent = catchAsync(async (req, res, next) => {
    const { studentId, subjectId } = req.query;
    const pipeline = [
        {
            $match: {
                studentId,
                subjectId,
            },
        },
        {
            $group: {
                _id: '$studentId',
                totalAttendance: {
                    $sum: 1,
                },
            },
        },
    ];

    const result = await Attendance.aggregate(pipeline);
    res.status(200).json({
        status: 'success',
        data: {
            attendance: result[0],
        },
    });
});

exports.createAttendance = catchAsync(async (req, res, next) => {
    const { studentId, subjectId } = req.body;

    const attendance = new Attendance({
        studentId,
        subjectId,
        date: new Date(),
    });

    const newAttendance = await attendance.save();

    res.status(201).json({
        status: 'success',
        data: {
            attendance: newAttendance,
        },
    });
});
