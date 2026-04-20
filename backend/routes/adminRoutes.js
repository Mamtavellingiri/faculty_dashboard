const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/faculties', [verifyToken, isAdmin], adminController.getAllFaculties);
router.get('/metrics', [verifyToken, isAdmin], adminController.getSystemMetrics);

module.exports = router;
