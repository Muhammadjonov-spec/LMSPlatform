const UserRepository=require("../repositories/UserRepository")
const TeacherRepository=require("../repositories/TeacherRepository")
const AppError = require("../utils/AppError")

class TeacherService{
  async applyForTeacher(userId, data){
    const existingProfile = await TeacherRepository.findOne({ user: userId });
    if (existingProfile) {
      throw new AppError(400, "Siz allaqachon o'qituvchilikka ariza yuborgansiz!");
    }

    const newTeacher=await TeacherRepository.create({
      user: userId,
      bio: data.bio,
      expertise: data.expertise,
      experienceYears: data.experienceYears,
      socialLinks: data.socialLinks
    })
    return{ message: "Arizangiz muvaffaqiyatli qabul qilindi. Admin tasdiqlashini kuting.", teacher: newTeacher}
  }

  async approveTeacher(teacherId){
    const teacher=await TeacherRepository.findById(teacherId)
    if(!teacher){
      throw new AppError(404, "Oqituvchi profili topilmadi")
    }
    if(teacher.isApproved){
      throw new AppError(400, "bu oqituvchi allaqachon tasdiqlangan")
    }
    await UserRepository.update(teacher.user, {role:"teacher"})
    return {message:"O'qituvchi muvaffaqiyatli tasdiqlandi va unga ruxsatlar berildi"}
  }
  async getTeacherProfile(teacherId){
    const teacher=await TeacherRepository.findById(teacherId)
    if (!teacher) {
      throw new AppError(404, "O'qituvchi topilmadi")
    }
    const populatedTeacher = await TeacherRepository.model.findById(teacherId).populate("user", "firstName lastName email avatar")
    return populatedTeacher
  }
  async updateProfile(userId, updateData){
    const teacher=await TeacherRepository.findOne(userId)
    if (!teacher) {
      throw new AppError(404, "Sizning o'qituvchi profilingiz yo'q")
    }

    const updatedProfile=await TeacherRepository.update(teacher._id, updateData)
    return updateProfile
  }
}

module.exports=new TeacherService()