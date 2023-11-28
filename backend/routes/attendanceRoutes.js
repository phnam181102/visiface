const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/', authController.protect, attendanceController.createAttendance);
router.get(
    '/summary',
    authController.protect,
    attendanceController.getAttendanceSummaryForStudent,
);

module.exports = router;
