const CategoryService=require("../services/category.service")

class CategoryController{
  async createCategory(req, res){
    const name=req.body.name
    const result=await CategoryService.create({name:name})
    res.status(200).json({success:true, data:result})
  }
  async getAllCategories(req, res){
    const data=await CategoryService.getAll()
    res.status(200).json({success:true, data:data})
  }
  async updateCategory(req, res){
    const newId=req.params.id
    const newName=req.body.name
    const result=await CategoryService.update(newId, {name:newName})
    res.status(200).json({success:true, data:result})
  }
  async deleteCategory(req, res){
    const newId=req.params.id
    const result=await CategoryService.delete(newId)
    res.status(200).json({success:true, message:"Successfully deleted category name"})
  }
}

module.exports=new CategoryController()