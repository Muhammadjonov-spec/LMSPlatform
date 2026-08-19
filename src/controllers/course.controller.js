const CourseService=require("../services/course.service")
const AppError = require('../utils/AppError');
class CourseController {
  async getAllCourses(req, res) {
    const result = await CourseService.getAllCourses(req.user);
    res.status(200).json({ success: true, data: result });
  }

  async getPublicCourses(req, res) {
    const result = await CourseService.getPublicCourses();
    res.status(200).json({ success: true, data: result });
  }

  async getPublicCourseDetails(req, res){
    const courseId = req.params.id;
    const result = await CourseService.getCourseDetails(courseId, null);
    res.status(200).json({ success: true, data: result });
  }

  async createCourse(req, res){
    const user = req.user;
    const data = req.body;
    
    if (data.name && !data.title) data.title = data.name;
    if (data.categoryId && !data.category) data.category = data.categoryId;
    
    if (req.file) {
      data.previewVideo = req.file.path;
    }
    
    if (data.isFree === 'true' || data.isFree === true) {
      data.isFree = true;
      data.price = 0;
    } else {
      data.isFree = false;
      data.price = Number(data.price) || 0;
    }

    const result = await CourseService.createCourse(data, user);
    res.status(201).json({ success: true, data: result });
  }
  async getCourceDetails(req, res){
    const user=req.user
    const courseId=req.params.id
    const result=await CourseService.getCourseDetails(courseId, user)
    res.status(200).json({success: true, data: result})
  }

  async updateThumbnail(req, res) {
    const courseId = req.params.id;
    if (!req.file) {
      throw new AppError(400, "Iltimos rasmni yuklang");
    }
    const thumbnailPath = req.file.path;
    const result = await CourseService.updateCourse(courseId, { thumbnail: thumbnailPath }, req.user);
    res.status(200).json({ success: true, data: result });
  }

  async addModule(req, res) {
    const courseId = req.params.id;
    const user = req.user;
    const { moduleTitle } = req.body;
    const result = await CourseService.addModule(moduleTitle, user, courseId);
    res.status(201).json({ success: true, data: result });
  }

  async addLesson(req, res) {
    const { courseId, moduleId } = req.params;
    const user = req.user;
    const { title } = req.body
    if(!req.file) throw new AppError(400, "Iltimos videoni yuklang")
    const inputPath=req.file.path
    const result = await CourseService.addLesson(title, inputPath, courseId, moduleId, user);
    res.status(201).json({ success: true, message: "Dars qabul qilindi. Video orqa fonda tayyorlanmoqda...", data: result });
  }
  async updateCourse(req, res) {
    const courseId = req.params.id;
    const user = req.user;
    const data = req.body;
    
    if (data.name && !data.title) data.title = data.name;
    if (data.categoryId && !data.category) data.category = data.categoryId;
    
    if (req.file) {
      data.previewVideo = req.file.path;
    }
    
    if (data.isFree === 'true' || data.isFree === true) {
      data.isFree = true;
      data.price = 0;
    } else {
      data.isFree = false;
      data.price = Number(data.price) || 0;
    }

    const result = await CourseService.updateCourse(courseId, data, user);
    res.status(200).json({ success: true, data: result });
  }

  async deleteCourse(req, res) {
    const courseId = req.params.id;
    const user = req.user;
    const result = await CourseService.deleteCourse(courseId, user);
    res.status(200).json({ success: true, message: "Kurs muvaffaqiyatli o'chirildi", data: result });
  }

  async getDetailContent(req, res) {
    const contentId = req.params.id;
    const result = await CourseService.getDetailContent(contentId, req.user);
    res.status(200).json({ success: true, data: result });
  }

  async updateContent(req, res) {
    const contentId = req.params.id;
    const user = req.user;
    const data = req.body;
    if (req.file) {
      data.videoPath = req.file.path;
    }
    const result = await CourseService.updateContent(contentId, data, user);
    res.status(200).json({ success: true, data: result });
  }

  async deleteDetailContent(req, res) {
    const contentId = req.params.id;
    const result = await CourseService.deleteDetailContent(contentId, req.user);
    res.status(200).json({ success: true, data: result });
  }
}

module.exports = new CourseController()
