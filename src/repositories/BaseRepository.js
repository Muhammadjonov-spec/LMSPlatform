class BaseRepository {
  constructor(model) {
    this.model = model;
  }
  async create(data){
    return await this.model.create(data)
  }
  async find(filter={}, options={}){
    return await this.model.find(filter, null, options)
  }
  async findOne(filter={}){
    return await this.model.findOne(filter).lean()
  }
  async findById(id){
    return await this.model.findById(id).lean()
  }
  async update(id, data){
    return await this.model.findByIdAndUpdate(id, data, {returnDocument:"after", runValidators:true}).lean()
  }
  async delete(id){
    return await this.model.findByIdAndDelete(id)
  }
  async count (filter={}){
    return await this.model.countDocuments(filter)
  }

  
}

module.exports = BaseRepository
