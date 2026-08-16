const CourseService=require("../services/course.service")

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
    const  teacherId=req.user._id
    const data=req.body
    if (data.name && !data.title) data.title = data.name;
    if (data.categoryId && !data.category) data.category = data.categoryId;

    const result=await CourseService.createCourse(data, teacherId)
    res.status(201).json({success:true, data:result})
  }
  async getCourceDetails(req, res){
    const user=req.user._id
    const courseId=req.params.id
    const result=await CourseService.getCourseDetails(courseId, user)
    res.status(200).json({success: true, data: result})
  }

  async addModule(req, res) {
    const courseId = req.params.id;
    const teacherId = req.user._id;
    const { moduleTitle } = req.body;
    const result = await CourseService.addModule(moduleTitle, teacherId, courseId);
    res.status(201).json({ success: true, data: result });
  }

  async addLesson(req, res) {
    const { courseId, moduleId } = req.params;
    const teacherId = req.user._id;
    const { title } = req.body
    if(!req.file) throw new AppError(400, "Iltimos videoni yuklang")
    const inputPath=req.file.path
    const result = await CourseService.addLesson(title, inputPath, courseId, moduleId, teacherId);
    res.status(201).json({ success: true, message: "Dars qabul qilindi. Video orqa fonda tayyorlanmoqda...", data: result });
  }
}

module.exports = new CourseController()
