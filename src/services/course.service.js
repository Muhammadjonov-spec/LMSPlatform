const CourseRepository = require('../repositories/CourseRepository');
const AppError = require('../utils/AppError');

class CourseService {
  async createCourse(data, teacherId) {
    const courseData = { ...data, teacher: teacherId };
    return await CourseRepository.create(courseData);
  }
  async getCourseDetails(courseId, user) {
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new AppError(404, "Kurs topilmadi");
    }
    let isEnrolled = false;
    
    if (user) {
      const enrolled = user.enrolledCourses.find(c => c.toString() === courseId.toString());
      if (enrolled || ['admin', 'super_admin', 'teacher'].includes(user.role)) {
         isEnrolled = true;
      }
    }
    if (!isEnrolled) {
       const hiddenCourse = JSON.parse(JSON.stringify(course))
       if (hiddenCourse.modules) {
         hiddenCourse.modules.forEach(module => {
           module.lessons.forEach(lesson => {
             lesson.videoPath = null; 
           });
         });
       }
       return hiddenCourse
    }
    return course
  }
}

module.exports = new CourseService()