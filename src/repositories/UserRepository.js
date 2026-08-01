const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User)
  }
  async findByEmail(email){
    return await this.model.findOne({email}).lean()
  }
  async searchUsers(query){
    return await this.model.find({$or:[{ firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }]}).lean()
  }

}

module.exports = new UserRepository()
