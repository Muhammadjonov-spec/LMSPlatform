const Teacher=require("../models/Teacher")
const BaseRepository=require("./BaseRepository")

class TeacherRepository extends BaseRepository{
  constructor(){
    super(Teacher) 
  }
}


module.exports=new TeacherRepository()
