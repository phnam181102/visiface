const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const classRouter = require('./routes/classRoutes');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const studentRouter = require('./routes/studentRoutes');
const subjectRouter = require('./routes/subjectRoutes');
const attendanceRouter = require('./routes/attendanceRoutes');
const classroomRouter = require('./routes/classroomRoutes');
const classroomScheduleRouter = require('./routes/classroomScheduleRoutes');

const app = express();
app.use(cors());

// NOTE: 1. MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Custom middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/subjects', subjectRouter);
app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/classroom', classroomRouter);
app.use('/api/v1/classroom-schedule', classroomScheduleRouter);

app.get('/', (req, res) => {
    // Wait for connect DB to testing with Cypress
    setTimeout(() => {
        res.status(200).json({
            status: 'success',
        });
    }, 5000);
});

app.all('*', (req, res, next) => {
    /*
    // 💻 Way 01 - Basic
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`,
    });

    // 💻 Way 02 - Pass the error into "ERROR HANDLING MIDDLEWARE"
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
    */

    // 💻 Way 03 - Update from Way01 (use Class AppError)
    next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});

// 💻 ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// NOTE: 4. START SERVER
module.exports = app;
