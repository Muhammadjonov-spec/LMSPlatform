const CourseRepository = require('../repositories/CourseRepository');
const TeacherRepository = require('../repositories/TeacherRepository');
const AppError = require('../utils/AppError');
const VideoQueueService = require('./videoQueue.service');

class CourseService {
  async createCourse(data, user) {
    let teacherId = null;
    if (user.role === 'teacher') {
      const teacherProfile = await TeacherRepository.findByUserId(user._id);
      if (!teacherProfile) throw new AppError(403, "Teacher profile not found");
      teacherId = teacherProfile._id;
    }
    const courseData = { ...data, teacher: teacherId };
    return await CourseRepository.create(courseData);
  }

  async getPublicCourses() {
    return await CourseRepository.findWithCategory();
  }

  async getAllCourses(user) {
    if (user.role === 'teacher') {
      const teacherProfile = await TeacherRepository.findByUserId(user._id);
      if (!teacherProfile) return [];
      return await CourseRepository.findWithCategory({ teacher: teacherProfile._id });
    } else if (['admin', 'super_admin'].includes(user.role)) {
      return await CourseRepository.findWithCategory();
    }
    return [];
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
  async addModule(moduleTitle, user, courseId) {
    const course = await CourseRepository.findById(courseId)
    if (!course) throw new AppError(404, "Kurs topilmadi")
    
    if (!['admin', 'super_admin'].includes(user.role)) {
      const teacherProfile = await TeacherRepository.findByUserId(user._id);
      if (!teacherProfile || course.teacher?.toString() !== teacherProfile._id.toString()) {
        throw new AppError(403, "Bu kursga modul qo'shish huquqingiz yo'q");
      }
    }   
    course.modules.push({ title: moduleTitle, lessons: [] })
    await CourseRepository.update(courseId, { modules: course.modules });
    return course;
  }

  async addLesson(title, inputPath, courseId, moduleId, user) {
    const course = await CourseRepository.findById(courseId)
    if (!course) throw new AppError(404, "Kurs topilmadi")
    
    if (!['admin', 'super_admin'].includes(user.role)) {
      const teacherProfile = await TeacherRepository.findByUserId(user._id);
      if (!teacherProfile || course.teacher?.toString() !== teacherProfile._id.toString()) {
        throw new AppError(403, "Bu kursga dars qo'shish huquqingiz yo'q");
      }
    }

    const moduleIndex = course.modules.findIndex(m => m._id.toString() === moduleId.toString())
    if (moduleIndex === -1) throw new AppError(404, "Modul topilmadi")
    
    const { Types } = require('mongoose');
    const newLessonId = new Types.ObjectId();
    const newLesson = { _id: newLessonId, title: title, videoPath: null, status: "processing" };
    course.modules[moduleIndex].lessons.push(newLesson);
    
    await CourseRepository.update(courseId, { modules: course.modules });
    
    const outputFolder = `lesson_${Date.now()+Math.round(Math.random()*10)}`;
    VideoQueueService.addJob(courseId, moduleId, newLessonId, inputPath, outputFolder);
    return newLesson;
  }
  
  async updateCourse(courseId, data, user) {
    const course = await CourseRepository.findById(courseId);
    if (!course) throw new AppError(404, "Kurs topilmadi");

    if (!['admin', 'super_admin'].includes(user.role)) {
      const teacherProfile = await TeacherRepository.findByUserId(user._id);
      if (!teacherProfile || course.teacher?.toString() !== teacherProfile._id.toString()) {
        throw new AppError(403, "Bu kursni tahrirlash huquqingiz yo'q");
      }
    }
    
    return await CourseRepository.update(courseId, data);
  }

  async getDetailContent(contentId, user) {
    const course = await CourseRepository.findByLessonId(contentId);
    if (!course) throw new AppError(404, "Kontent topilmadi");
    
    let targetLesson = null;
    course.modules.forEach(m => {
      const lesson = m.lessons.find(l => l._id.toString() === contentId.toString());
      if (lesson) targetLesson = lesson;
    });
    
    return targetLesson;
  }

  async updateContent(contentId, data, user) {
    const course = await CourseRepository.findByLessonId(contentId);
    if (!course) throw new AppError(404, "Kontent topilmadi");

    if (!['admin', 'super_admin'].includes(user.role)) {
      const teacherProfile = await TeacherRepository.findByUserId(user._id);
      if (!teacherProfile || course.teacher?.toString() !== teacherProfile._id.toString()) {
        throw new AppError(403, "Bu kontentni tahrirlash huquqingiz yo'q");
      }
    }

    let targetModuleIndex = -1;
    let targetLessonIndex = -1;
    course.modules.forEach((m, mIndex) => {
      const lIndex = m.lessons.findIndex(l => l._id.toString() === contentId.toString());
      if (lIndex !== -1) {
        targetModuleIndex = mIndex;
        targetLessonIndex = lIndex;
      }
    });

    if (data.title) course.modules[targetModuleIndex].lessons[targetLessonIndex].title = data.title;
    if (data.text) course.modules[targetModuleIndex].lessons[targetLessonIndex].text = data.text;
    
    if (data.videoPath) {
      course.modules[targetModuleIndex].lessons[targetLessonIndex].status = "processing";
      course.modules[targetModuleIndex].lessons[targetLessonIndex].videoPath = null;
      const outputFolder = `lesson_${Date.now()+Math.round(Math.random()*10)}`;
      VideoQueueService.addJob(course._id, course.modules[targetModuleIndex]._id, contentId, data.videoPath, outputFolder);
    }

    await CourseRepository.update(course._id, { modules: course.modules });
    return course.modules[targetModuleIndex].lessons[targetLessonIndex];
  }

  async deleteDetailContent(contentId, user) {
    const course = await CourseRepository.findByLessonId(contentId);
    if (!course) throw new AppError(404, "Kontent topilmadi");

    if (!['admin', 'super_admin'].includes(user.role)) {
      const teacherProfile = await TeacherRepository.findByUserId(user._id);
      if (!teacherProfile || course.teacher?.toString() !== teacherProfile._id.toString()) {
        throw new AppError(403, "Bu kontentni o'chirish huquqingiz yo'q");
      }
    }

    let targetModuleIndex = -1;
    course.modules.forEach((m, mIndex) => {
      const lIndex = m.lessons.findIndex(l => l._id.toString() === contentId.toString());
      if (lIndex !== -1) {
        targetModuleIndex = mIndex;
      }
    });

    course.modules[targetModuleIndex].lessons = course.modules[targetModuleIndex].lessons.filter(l => l._id.toString() !== contentId.toString());
    await CourseRepository.update(course._id, { modules: course.modules });
    return { message: "O'chirildi" };
  }
}

module.exports = new CourseService();