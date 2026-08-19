const Teacher=require("../models/Teacher")
const BaseRepository=require("./BaseRepository")

class TeacherRepository extends BaseRepository{
  constructor(){
    super(Teacher) 
  }

  async findByUserId(userId) {
    return await this.model.findOne({ user: userId });
  }
}


module.exports=new TeacherRepository()
