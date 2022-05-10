const express = require('express');

const managerController = require('../controllers/manager');
const isAuth = require('./middleware/confirm').isAuth
const isManager = require('./middleware/confirm').isManager

const router = express.Router();

router.get('/reports', isAuth, isManager, managerController.getAllReports);

router.post('/delete-report/:reportId', isAuth, isManager, managerController.deleteOldReports);

router.post('/disable-changes/:reportId', isAuth, isManager, managerController.postDisableChanges);

router.get('/health-declaration', isAuth, isManager, employeeController.getDeclaration);

module.exports = router;