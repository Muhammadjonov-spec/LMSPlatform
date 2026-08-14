const CategoryRepository=require("../repositories/CategoryRepository")
const AppError=require("../utils/AppError")
const BaceService=require("./bace.service")
class CategoryService extends BaceService{
  constructor(){
    super(CategoryRepository, "Category")
  }
}

module.exports=new CategoryService()
