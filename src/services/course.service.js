const CourseRepository = require('../repositories/CourseRepository');
const TeacherRepository = require('../repositories/TeacherRepository');
const AppError = require('../utils/AppError');
const VideoQueueService = require('./videoQueue.service');
const fs = require('fs');
const path = require('path');
const { Types } = require('mongoose');
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
    const course = await CourseRepository.findDetailsById(courseId);
    if (!course) {
      throw new AppError(404, "Kurs topilmadi");
    }
    let isEnrolled = false;
    
    if (user) {
      const enrolledCourses = user.enrolledCourses || [];
      const enrolled = enrolledCourses.find(c => c.toString() === courseId.toString());
      
      if (enrolled || ['admin', 'super_admin'].includes(user.role)) {
         isEnrolled = true;
      } else if (user.role === 'teacher') {
         const teacherProfile = await TeacherRepository.findByUserId(user._id);
         if (teacherProfile && course.teacher?._id?.toString() === teacherProfile._id.toString()) {
            isEnrolled = true;
         }
      }
    }
    
    if (course.isFree) {
       isEnrolled = true;
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
       hiddenCourse.isEnrolled = false;
       return hiddenCourse
    }
    const fullCourse = JSON.parse(JSON.stringify(course))
    fullCourse.isEnrolled = true;
    return fullCourse
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

  async deleteCourse(courseId, user) {
    const course = await CourseRepository.findById(courseId);
    if (!course) throw new AppError(404, "Kurs topilmadi");

    if (!['admin', 'super_admin'].includes(user.role)) {
      const teacherProfile = await TeacherRepository.findByUserId(user._id);
      if (!teacherProfile || course.teacher?.toString() !== teacherProfile._id.toString()) {
        throw new AppError(403, "Bu kursni o'chirish huquqingiz yo'q");
      }
    }
    try {
      if (course.thumbnail) {
        const thumbnailPath = path.join(__dirname, '..', '..', course.thumbnail);
        if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
      }
      if (course.previewVideo) {
        const previewPath = path.join(__dirname, '..', '..', course.previewVideo);
        if (fs.existsSync(previewPath)) fs.unlinkSync(previewPath);
      }
      if (course.modules) {
        course.modules.forEach(m => {
          if (m.lessons) {
            m.lessons.forEach(l => {
              if (l.videoPath) {
                const videoFolder = path.join(__dirname, '..', '..', 'public', 'uploads', 'courses', courseId.toString());
                if (fs.existsSync(videoFolder)) {
                   fs.rmSync(videoFolder, { recursive: true, force: true });
                }
              }
            });
          }
        });
      }
    } catch (err) {
      console.error("Error deleting course files:", err);
    }
    
    await CourseRepository.delete(courseId);
    return { message: "O'chirildi" };
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

    const updatedModules = JSON.parse(JSON.stringify(course.modules));
    if (data.title) updatedModules[targetModuleIndex].lessons[targetLessonIndex].title = data.title;
    if (data.text) updatedModules[targetModuleIndex].lessons[targetLessonIndex].text = data.text;
    
    if (data.videoPath) {
      updatedModules[targetModuleIndex].lessons[targetLessonIndex].status = "processing";
      updatedModules[targetModuleIndex].lessons[targetLessonIndex].videoPath = null;
      const outputFolder = `lesson_${Date.now()+Math.round(Math.random()*10)}`;
      VideoQueueService.addJob(course._id, updatedModules[targetModuleIndex]._id, contentId, data.videoPath, outputFolder);
    }

    await CourseRepository.update(course._id, { modules: updatedModules });
    return updatedModules[targetModuleIndex].lessons[targetLessonIndex];
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
        const lesson = m.lessons[lIndex];
        if (lesson.videoPath) {
          try {
            const folderName = lesson.videoPath.split('/')[2];
            if (folderName) {
              const videoFolder = path.join(__dirname, '..', '..', 'public', 'videos', folderName);
              if (fs.existsSync(videoFolder)) {
                fs.rmSync(videoFolder, { recursive: true, force: true });
              }
            }
          } catch (err) {
            throw new AppError(500, `Error deleting lesson video folder: ${err}`);
          }
        }
      }
    });

    if (targetModuleIndex === -1) {
      throw new AppError(404, "Kontent topilmadi (modul ichida)");
    }

    const updatedModules = JSON.parse(JSON.stringify(course.modules));
    updatedModules[targetModuleIndex].lessons = updatedModules[targetModuleIndex].lessons.filter(l => l._id.toString() !== contentId.toString());
    await CourseRepository.update(course._id, { modules: updatedModules });
    return { message: "O'chirildi" };
  }
}

module.exports = new CourseService();