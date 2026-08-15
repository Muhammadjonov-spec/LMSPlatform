const progressService = require("../services/progress.service");

class ProgressController {
  async getProgress(req, res) {
    try {
      const { courseId } = req.params;
      const studentId = req.user._id;

      const progress = await progressService.getProgress(studentId, courseId);
      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async markCompleted(req, res) {
    try {
      const { courseId, lessonId } = req.params;
      const studentId = req.user._id;

      const progress = await progressService.markLessonCompleted(studentId, courseId, lessonId);
      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ProgressController();