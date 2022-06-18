const express = require('express');

const managerController = require('../controllers/manager');
const confirmAuth = require('../middlewares/confirm').confirmAuth
const confirmManager = require('../middlewares/confirm').confirmManager

const router = express.Router();

router.get('/reports', confirmAuth, confirmManager, managerController.getAllReports);
router.get('/reports/:userId', confirmAuth, confirmManager, managerController.getReportDetails); 

router.post('/delete-report/:userId', confirmAuth, confirmManager, managerController.deleteOldReports);

router.post('/toggle-changes/:userId', confirmAuth, confirmManager, managerController.postToggleChanges);

router.get('/get-declaration', confirmAuth, confirmManager, managerController.getPdfDeclaration);

module.exports = router;