const express = require('express');

const managerController = require('../controllers/manager');
const confirmAuth = require('../middlewares/confirm').confirmAuth
const confirmManager = require('../middlewares/confirm').confirmManager

const router = express.Router();

router.get('/reports', confirmAuth, confirmManager, managerController.getAllReports);

router.post('/delete-report', confirmAuth, confirmManager, managerController.deleteOldReports);

router.post('/disable-changes', confirmAuth, confirmManager, managerController.postDisableChanges);

router.get('/get-declaration', confirmAuth, confirmManager, managerController.getDeclaration);

module.exports = router;