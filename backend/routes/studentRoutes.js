const express = require('express');
const studentController = require('../controllers/studentController');
const authController = require('../controllers/authController');

const router = express.Router();

router.patch(
    '/:id/train',
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    studentController.updateStudentTrainingStatus,
);

router
    .route('/')
    .get(studentController.getAllStudents)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        studentController.createStudent,
    );

router
    .route('/:id')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        studentController.getStudent,
    )
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        studentController.updateStudent,
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        studentController.deleteStudent,
    );

module.exports = router;
