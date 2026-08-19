const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');
const { isAuth } = require('../middlewares/auth.middleware');

router.post("/:courseId", isAuth, ReviewController.createReview);
router.get("/", ReviewController.getAllReviews);
router.get("/:courseId", ReviewController.getCourseReviews);

module.exports = router;
