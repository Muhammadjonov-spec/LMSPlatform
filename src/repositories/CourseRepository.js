const BaseRepository =require("./BaseRepository") 
const Course=require("../models/Course")
class CourseRepository extends BaseRepository{
  constructor(){
    super(Course)
  }
  async updateLessonStatus(courseId, moduleId, lessonId, videoUrl, status) {
    return await this.model.findOneAndUpdate(
      { _id: courseId, "modules._id": moduleId, "modules.lessons._id": lessonId },
      { 
        $set: { 
          "modules.$[mod].lessons.$[les].videoPath": videoUrl,
          "modules.$[mod].lessons.$[les].status": status 
        }
      },
      { arrayFilters: [{ "mod._id": moduleId }, { "les._id": lessonId }], new: true }
    );
  }

  async findByLessonId(lessonId) {
    return await this.model.findOne({ "modules.lessons._id": lessonId });
  }

  async findWithCategory(filter = {}) {
    return await this.model.find(filter).populate('category');
  }

  async findDetailsById(id) {
    return await this.model.findById(id)
      .populate('category')
      .populate({
        path: 'teacher',
        populate: {
          path: 'user',
          select: 'firstName lastName avatar'
        }
      })
      .lean();
  }
}


module.exports=new CourseRepository()