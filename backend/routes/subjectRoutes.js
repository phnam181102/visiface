const express = require('express');
const subjectController = require('../controllers/subjectController');
const authController = require('../controllers/authController');
const classroomScheduleController = require('../controllers/classroomScheduleController');

const router = express.Router();

router.get(
    '/teacherSubjects/:teacherId',
    authController.protect,
    subjectController.getAllTeacherSubjects,
);

router
    .route('/')
    .get(subjectController.getAllSubjects)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        classroomScheduleController.createClassroomSchedule,
        subjectController.createSubject,
    );

router
    .route('/:id')
    .get(subjectController.getSubject)
    .patch(authController.protect, subjectController.updateSubject)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        subjectController.deleteSubject,
    );

module.exports = router;
