const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { verifyToken, isFaculty } = require('../middleware/authMiddleware');

router.get('/profile', [verifyToken, isFaculty], facultyController.getProfile);
router.post('/performance', [verifyToken, isFaculty], facultyController.addPerformance);

module.exports = router;
