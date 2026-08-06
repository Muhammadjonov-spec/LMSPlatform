const BaseRepository=require("./BaseRepository")
const Order=require("../models/Order")
class OrderRepository extends BaseRepository{
  constructor(){
    super(Order)
  }


  
}

module.exports=new OrderRepository()