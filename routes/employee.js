const express = require('express');

const employeeController = require('../controllers/auth');
const isAuth = require('./middleware/confirm').isAuth

const router = express.Router();

router.get('/reports/:reportId', isAuth, managerController.getReportDetails); 

router.post('/select-month', isAuth, managerController.postSelectedMonth); 

router.get('/attendance/:userId', isAuth, employeeController.getAttendance);

router.post('/check-in/:reportId',  isAuth, employeeController.postCheckIn);
router.post('/check-out/:reportId', isAuth, employeeController.postCheckOut);

router.post('/register-leave/:userId', isAuth, employeeController.postRegisterLeave);

router.get('/profile/:userId', isAuth, employeeController.getProfile);
router.post('/profile/:userId', isAuth, employeeController.postProfile);

router.get('/health-declaration/:userId', isAuth, employeeController.getHealthDeclaration);
router.post('/health-declaration/:userId', isAuth, employeeController.postHealthDeclaration);

module.exports = router;