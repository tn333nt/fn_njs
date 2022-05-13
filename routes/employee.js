const express = require('express');

const employeeController = require('../controllers/employee');
const confirmAuth = require('../middlewares/confirm').confirmAuth

const router = express.Router();

router.get('/attendance', confirmAuth, employeeController.getAttendance);

router.get('/report-details/:userId', confirmAuth, employeeController.getReportDetails); 
router.get('/report-details', confirmAuth, employeeController.getReportDetails); 

router.post('/select-month', confirmAuth, employeeController.postSelectedMonth); 

router.post('/check-in',  confirmAuth, employeeController.postCheckIn);
router.post('/check-out', confirmAuth, employeeController.postCheckOut);

router.post('/register-leave', confirmAuth, employeeController.postRegisterLeave);

router.get('/profile', confirmAuth, employeeController.getProfile);
router.post('/profile', confirmAuth, employeeController.postProfile);

router.get('/health-declaration', confirmAuth, employeeController.getHealthDeclaration);
router.post('/health-declaration', confirmAuth, employeeController.postHealthDeclaration);

module.exports = router;