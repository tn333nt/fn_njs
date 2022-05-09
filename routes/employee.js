const express = require('express');

const employeeController = require('../controllers/employee');

const router = express.Router();

router.get('/work-reports/:reportId', managerController.getReportDetails); //

router.post('/start-work', employeeController.postStartWork);
router.get('/start-work', employeeController.getStartWork);
router.post('/finish-work', employeeController.postFinishWork);
router.get('/finish-work', employeeController.getFinishWork);

router.post('/register-leave', employeeController.postRegisterLeave);

router.get('/attendance', employeeController.getAttendance);

router.get('/profile', employeeController.getProfile);

router.post('/health-declaration', employeeController.postHealthDeclaration);

module.exports = router;