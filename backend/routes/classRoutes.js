const express = require('express');
const classController = require('../controllers/classController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(classController.getAllClasses)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        classController.createClass,
    );

router
    .route('/:id')
    .get(classController.getClass)
    .patch(authController.protect, classController.updateClass)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        classController.deleteClass,
    );

module.exports = router;
