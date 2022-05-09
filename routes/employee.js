const express = require('express');

const employeeController = require('../controllers/auth');
const isAuth = require('./middleware/isAuth');

const router = express.Router();

router.get('/work-reports/:reportId', isAuth, managerController.getReportDetails); //

router.post('/start-work',  isAuth, employeeController.postStartWork);
router.get('/start-work', isAuth, employeeController.getStartWork);
router.post('/finish-work', isAuth, employeeController.postFinishWork);
router.get('/finish-work', isAuth, employeeController.getFinishWork);

router.post('/register-leave', isAuth, isAuth, employeeController.postRegisterLeave);

router.get('/attendance', isAuth, employeeController.getAttendance);

router.get('/profile', isAuth, employeeController.getProfile);
router.post('/profile', isAuth, employeeController.postProfile);

router.post('/health-declaration', isAuth, employeeController.postHealthDeclaration);

module.exports = router;