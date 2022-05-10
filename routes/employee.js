const express = require('express');

const employeeController = require('../controllers/auth');
const isAuth = require('./middleware/confirm').isAuth

const router = express.Router();

router.get('/reports/:reportId', isAuth, managerController.getReportDetails); 

router.post('/check-in',  isAuth, employeeController.postCheckIn);
router.get('/check-in', isAuth, employeeController.getCheckIn);
router.post('/check-out', isAuth, employeeController.postCheckOut);
router.get('/check-out', isAuth, employeeController.getCheckOut);

router.post('/register-leave', isAuth, employeeController.postRegisterLeave);

router.get('/attendance', isAuth, employeeController.getAttendance);

router.get('/profile', isAuth, employeeController.getProfile);
router.post('/profile', isAuth, employeeController.postProfile);

router.post('/health-declaration/:userId', isAuth, employeeController.postHealthDeclaration);

module.exports = router;