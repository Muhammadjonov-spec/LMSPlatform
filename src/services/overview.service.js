const UserRepository = require('../repositories/UserRepository');
const CourseRepository = require('../repositories/CourseRepository');

class OverviewService {
  async getOverviewStats() {
    const totalStudents = await UserRepository.model.countDocuments({ role: 'student' });
    const totalTeachers = await UserRepository.model.countDocuments({ role: 'teacher' });
    const totalCourses = await CourseRepository.model.countDocuments();
    const courses = await CourseRepository.model.find({}, 'modules.lessons.type');
    let totalVideo = 0;
    let totalText = 0;
    courses.forEach(c => {
      c.modules?.forEach(m => {
        m.lessons?.forEach(l => {
          if (l.type === 'video') totalVideo++;
          else if (l.type === 'text') totalText++;
        });
      });
    })
    const Progress = require('../models/Progress');
    const progresses = await Progress.find({}, 'percentage');
    let averageCompletion = 0;
    if (progresses.length > 0) {
      const sum = progresses.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
      averageCompletion = Math.round(sum / progresses.length);
    }

    const revenue = 1500000;
    
    return {
      totalStudents,
      totalTeachers,
      totalCourses,
      totalVideo,
      totalText,
      averageCompletion,
      revenue
    };
  }
}

module.exports = new OverviewService();
