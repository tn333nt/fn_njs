const express = require('express');

const employeeController = require('../controllers/auth');
const isAuth = require('./middleware/confirm').isAuth

const router = express.Router();

router.get('/reports/:reportId', isAuth, managerController.getReportDetails); 

router.post('/check-in/:reportId',  isAuth, employeeController.postCheckIn);
router.get('/check-in/:reportId', isAuth, employeeController.getCheckIn);
router.post('/check-out/:reportId', isAuth, employeeController.postCheckOut);
router.get('/check-out/:reportId', isAuth, employeeController.getCheckOut);

router.post('/register-leave/:userId', isAuth, employeeController.postRegisterLeave);

router.get('/attendance/:userId', isAuth, employeeController.getAttendance);

router.get('/profile/:userId', isAuth, employeeController.getProfile);
router.post('/profile/:userId', isAuth, employeeController.postProfile);

router.get('/health-declaration/:userId', isAuth, employeeController.getHealthDeclaration);
router.post('/health-declaration/:userId', isAuth, employeeController.postHealthDeclaration);

module.exports = router;