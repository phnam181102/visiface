const express = require('express');
const classroomScheduleController = require('../controllers/classroomScheduleController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(classroomScheduleController.getAllClassroomSchedules)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        classroomScheduleController.createClassroomSchedule,
    );

router.get(
    '/:classroomId/:weekday',
    authController.protect,
    classroomScheduleController.getClassroomScheduleByWeekday,
);
module.exports = router;
