const CourseService=require("../services/course.service")

class CourseController {
  async createCourse(req, res){
    const  teacherId=req.user._id
    const data=req.body
    const result=await CourseService.createCourse(data, teacherId)
    res.status(201).json({success:true, data:result})
  }
  async getCourceDetails(req, res){
    const user=req.user._id
    const courseId=req.params.id
    const result=await CourseService.getCourseDetails(courseId, user)
     res.status(200).json({success: true, data: result})
  }
}

module.exports = new CourseController()
