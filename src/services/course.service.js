const CourseRepository = require('../repositories/CourseRepository');
const AppError = require('../utils/AppError');
const VideoQueueService=require("./videoQueue.service")

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
  async addModule(moduleTitle, teacherId, courseId) {
    const course = await CourseRepository.findById(courseId)
    if (!course) throw new AppError(404, "Kurs topilmadi")
    if (course.teacher.toString() !== teacherId.toString()) {
      throw new AppError(403, "Bu kursga modul qo'shish huquqingiz yo'q");
    }
    course.modules.push({ title: moduleTitle, lessons: [] })
    await course.save()
    return course
  }

  async addLesson(title, inputPath, courseId, moduleId, teacherId) {
    const course = await CourseRepository.findById(courseId)
    if (!course) throw new AppError(404, "Kurs topilmadi")
    if (course.teacher.toString() !== teacherId.toString()) {
      throw new AppError(403, "Bu kursga dars qo'shish huquqingiz yo'q")
    }
    const moduleIndex = course.modules.findIndex(m => m._id.toString() === moduleId.toString())
    if (moduleIndex === -1) throw new AppError(404, "Modul topilmadi")
    course.modules[moduleIndex].lessons.push({ title: title, videoPath:null, status: "processing" })
    await course.save()
     const newLesson = course.modules[moduleIndex].lessons[course.modules[moduleIndex].lessons.length - 1]
     const outputFolder = `lesson_${Date.now()+Math.round(Math.random()*10)}`
     VideoQueueService.addJob(courseId, moduleId, newLesson._id, inputPath, outputFolder)
    return newLesson
  }
}

module.exports = new CourseService()