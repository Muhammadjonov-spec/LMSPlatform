const UserRepository = require('../repositories/UserRepository');
const CourseRepository = require('../repositories/CourseRepository');

class OverviewService {
  async getOverviewStats() {
    const totalStudents = await UserRepository.model.countDocuments({ role: 'student' });
    const totalTeachers = await UserRepository.model.countDocuments({ role: 'teacher' });
    const totalCourses = await CourseRepository.model.countDocuments();
    const revenue = 1500000;
    
    return {
      totalStudents,
      totalTeachers,
      totalCourses,
      revenue
    };
  }
}

module.exports = new OverviewService();
