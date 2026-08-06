const BaseRepository =require("./BaseRepository") 
const Course=require("../models/Course")
class CourseRepository extends BaseRepository{
  constructor(){
    super(Course)
  }
}


module.exports=new CourseRepository()