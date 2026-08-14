const Review=require("../models/Review")
const BaseReposiotry=require("./BaseRepository")

class ReviewRepository extends BaseReposiotry{
  constructor(){
    super(Review)
  }
}

module.exports=new ReviewRepository()