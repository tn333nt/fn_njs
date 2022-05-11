const express = require('express');

const employeeController = require('../controllers/employee');
const confirmAuth = require('../middlewares/confirm').confirmAuth

const router = express.Router();

router.get('/attendance', confirmAuth, employeeController.getAttendance);

router.get('/reports/:reportId', confirmAuth, employeeController.getReportDetails); 

router.post('/select-month', confirmAuth, employeeController.postSelectedMonth); 

router.post('/check-in/:reportId',  confirmAuth, employeeController.postCheckIn);
router.post('/check-out/:reportId', confirmAuth, employeeController.postCheckOut);

router.post('/register-leave/:userId', confirmAuth, employeeController.postRegisterLeave);

router.get('/profile', confirmAuth, employeeController.getProfile);
router.post('/profile', confirmAuth, employeeController.postProfile);

router.get('/health-declaration/:userId', confirmAuth, employeeController.getHealthDeclaration);
router.post('/health-declaration/:userId', confirmAuth, employeeController.postHealthDeclaration);

module.exports = router;