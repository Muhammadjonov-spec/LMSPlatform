const BaseRepository=require("./BaseRepository")
const Category=require("../models/Category")
class CategoryRepository extends BaseRepository{
  constructor(){
    super(Category)
  }

}

module.exports=new CategoryRepository()