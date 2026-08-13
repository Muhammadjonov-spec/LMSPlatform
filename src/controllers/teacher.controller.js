const TeacherService=require("../services/teacher.service")
class TeacherController{
  async updateProfile(req, res){
    const userId=req.user._id
    const userData=req.body
    const result=await TeacherService.updateProfile(userId, userData)
    res.status(200).json({success:true, data:result})
  }
  async getTeacherProfile(req, res){
    const teacherId=req.params.id
    const result=await TeacherService.getTeacherProfile(teacherId)
    res.status(200).json({success:true, data:result})
  }
  async approvedTeacher(req, res){
    const teacherId=req.params.id
    const result=await TeacherService.approveTeacher(teacherId)
    res.status(200).json({success:true, data:result})
  }
  async applyForTeacher(req, res){
    const teacherId=req.user._id
    const userData=req.body
    const result=await TeacherService.applyForTeacher(teacherId, userData)
    res.status(200).json({success:true, data:result})

  }
}

module.exports=new TeacherController()  