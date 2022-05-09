const express = require('express');

const managerController = require('../controllers/manager');

const router = express.Router();

router.get('/work-reports', managerController.getWorkReports);

router.post('/edit-reports/:reportId', managerController.postEditReportDetails);

// hay la tach rieng phan h giac ra nhi?

router.get('/health-declaration/:delarationId', employeeController.getDeclaration);

module.exports = router;