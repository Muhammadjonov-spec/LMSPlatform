const UserRepository=require("../repositories/UserRepository")
const TeacherRepository=require("../repositories/TeacherRepository")
const AppError = require("../utils/AppError")

class TeacherService{
  async applyForTeacher(userId, data){
    const existingProfile = await TeacherRepository.findOne({ user: userId });
    if (existingProfile) {
      if (existingProfile.status === 'rejected') {
        const updatedTeacher = await TeacherRepository.update(existingProfile._id, {
          bio: data.bio,
          expertise: data.expertise,
          experienceYears: data.experienceYears,
          phone: data.phone,
          socialLinks: data.socialLinks,
          status: 'pending',
          rejectionReason: null
        });
        return { message: "Arizangiz qayta yuborildi. Admin tasdiqlashini kuting.", teacher: updatedTeacher };
      }
      throw new AppError(400, "Siz allaqachon o'qituvchilikka ariza yuborgansiz!");
    }

    const newTeacher=await TeacherRepository.create({
      user: userId,
      bio: data.bio,
      expertise: data.expertise,
      experienceYears: data.experienceYears,
      phone: data.phone,
      socialLinks: data.socialLinks,
      status: 'pending'
    })
    return{ message: "Arizangiz muvaffaqiyatli qabul qilindi. Admin tasdiqlashini kuting.", teacher: newTeacher}
  }

  async getAllApplications() {
    return await TeacherRepository.model.find({}).populate("user", "firstName lastName email avatar role").sort({ _id: -1 });
  }

  async approveTeacher(teacherId){
    const teacher=await TeacherRepository.findById(teacherId)
    if(!teacher){
      throw new AppError(404, "Oqituvchi profili topilmadi")
    }
    if(teacher.isApproved || teacher.status === 'approved'){
      throw new AppError(400, "bu oqituvchi allaqachon tasdiqlangan")
    }
    await TeacherRepository.update(teacherId, {isApproved: true, status: 'approved'})
    await UserRepository.update(teacher.user, {role:"teacher"})
    return {message:"O'qituvchi muvaffaqiyatli tasdiqlandi va unga ruxsatlar berildi"}
  }

  async rejectTeacher(teacherId, reason){
    const teacher=await TeacherRepository.findById(teacherId)
    if(!teacher){
      throw new AppError(404, "Oqituvchi profili topilmadi")
    }
    if(teacher.isApproved || teacher.status === 'approved'){
      throw new AppError(400, "Bu oqituvchi allaqachon tasdiqlangan, bekor qilib bo'lmaydi")
    }
    await TeacherRepository.update(teacherId, {status: 'rejected', rejectionReason: reason})
    return {message:"O'qituvchi arizasi bekor qilindi"}
  }

  async getMyApplication(userId) {
    const teacher = await TeacherRepository.findOne({ user: userId });
    return teacher;
  }
  async getTeacherProfile(teacherId){
    const teacher=await TeacherRepository.findById(teacherId)
    if (!teacher) {
      throw new AppError(404, "O'qituvchi topilmadi")
    }
    const populatedTeacher = await TeacherRepository.model.findById(teacherId).populate("user", "firstName lastName email avatar")
    return populatedTeacher
  }

  async addModulToCource(){

  }
  async addLessonToModule(){
    
  }
  async updateProfile(userId, updateData){
    const teacher=await TeacherRepository.findOne({userId})
    if (!teacher) {
      throw new AppError(404, "Sizning o'qituvchi profilingiz yo'q")
    }

    const updatedProfile=await TeacherRepository.update(teacher._id, updateData)
    return updatedProfile
  }
}

module.exports=new TeacherService()