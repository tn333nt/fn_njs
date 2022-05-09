const express = require('express');

const managerController = require('../controllers/manager');

const router = express.Router();

router.get('/work-reports', isAuth, managerController.getWorkReports);

router.post('/edit-reports/:reportId', isAuth, managerController.postEditReportDetails);

// hay la tach rieng phan h giac ra nhi?

router.get('/health-declaration/:delarationId', isAuth, employeeController.getDeclaration);

module.exports = router;