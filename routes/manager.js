const express = require('express');

const managerController = require('../controllers/manager');
const isAuth = require('./middleware/confirm').isAuth
const isManager = require('./middleware/confirm').isManager

const router = express.Router();

router.get('/reports', isAuth, isManager, managerController.getAllReports);

router.post('/edit-report/:reportId', isAuth, isManager, managerController.postEditReportDetails);

router.post('/disable-changes/:reportId', isAuth, isManager, managerController.postDisableReport);

router.get('/health-declaration', isAuth, isManager, employeeController.getDeclaration);

module.exports = router;