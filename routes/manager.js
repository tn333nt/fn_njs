const express = require('express');

const managerController = require('../controllers/manager');
const isAuth = require('../middlewares/confirm').isAuth
const isManager = require('../middlewares/confirm').isManager

const router = express.Router();

router.get('/reports', isAuth, isManager, managerController.getAllReports);
router.get('/reports/:reportId', isAuth, isManager, managerController.getReportDetails); 

router.post('/select-number-of-report', isAuth, isManager, managerController.postNumberOfReport); // needed?

router.post('/delete-report/:reportId', isAuth, isManager, managerController.deleteOldReports);

router.post('/disable-changes/:reportId', isAuth, isManager, managerController.postDisableChanges);

router.get('/health-declaration', isAuth, isManager, managerController.getDeclaration);

module.exports = router;