const express = require('express');
const classroomController = require('../controllers/classroomController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(classroomController.getAllClassrooms)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        classroomController.createClassroom,
    );

router
    .route('/:id')
    .get(classroomController.getClassroom)
    .patch(authController.protect, classroomController.updateClassroom)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        classroomController.deleteClassroom,
    );

module.exports = router;
