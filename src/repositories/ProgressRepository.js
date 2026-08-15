const BaseRepository=require("./BaseRepository")
const Progress=require("../models/Progress")

class ProgressRepository extends BaseRepository {
  constructor(){
    super(Progress)
  }
}

module.exports = new ProgressRepository()