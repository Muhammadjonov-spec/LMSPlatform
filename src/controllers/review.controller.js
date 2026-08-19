const ReviewService = require('../services/review.service')

class ReviewController {
  async createReview(req, res) {
    const studentId = req.user._id;
    const courseId = req.params.courseId;
    const { rating, comment } = req.body;

    const result = await ReviewService.createReview(studentId, courseId, rating, comment);
    res.status(201).json({ success: true, data: result });
  }

  async getCourseReviews(req, res) {
    const courseId = req.params.courseId;
    const result = await ReviewService.getCourseReviews(courseId)
    res.status(200).json({ success: true, data: result })
  }

  async getAllReviews(req, res) {
    const result = await ReviewService.getAllReviews();
    res.status(200).json({ success: true, data: result });
  }
}

module.exports = new ReviewController()
