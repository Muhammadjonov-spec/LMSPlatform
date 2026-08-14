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
}


module.exports=new CourseRepository()