const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const { isAuth } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/:courseId', isAuth, progressController.getProgress);
router.post('/:courseId/lesson/:lessonId/complete', isAuth, progressController.markCompleted);

module.exports = router;