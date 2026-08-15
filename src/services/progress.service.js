const BaceService = require("./bace.service");
const ProgressRepository = require("../repositories/ProgressRepository");
const CourseRepository = require("../repositories/CourseRepository");

class ProgressService extends BaceService {
  constructor() {
    super(ProgressRepository, "Progress");
  }

  async getProgress(studentId, courseId) {
    let progress = await ProgressRepository.findOne({ student: studentId, course: courseId });
    if (!progress) {
      progress = await ProgressRepository.create({
        student: studentId,
        course: courseId,
        completedLessons: [],
        percentage: 0
      });
    }
    return progress;
  }

  async markLessonCompleted(studentId, courseId, lessonId) {
    let progress = await this.getProgress(studentId, courseId)
    if (!progress.completedLessons.includes(lessonId.toString())) {
      progress.completedLessons.push(lessonId.toString());
    }   
    progress.lastWatchedLesson = lessonId
    const course = await CourseRepository.findById(courseId);
    let totalLessons = 0;
    if (course) {
      totalLessons += course.lessons?.length || 0;
      course.modules?.forEach(m => totalLessons += m.lessons?.length || 0);
    }
    if (totalLessons > 0) {
      progress.percentage = Math.round((progress.completedLessons.length / totalLessons) * 100);
    }

    await progress.save();
    return progress;
  }
}

module.exports = new ProgressService();