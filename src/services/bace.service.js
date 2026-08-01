const AppError = require('../utils/AppError');

class BaseService {
  constructor(repository, resourceName = 'Resource') {
    this.repository = repository;
    this.resourceName = resourceName;
  }

  async getAll(query = {}, options = {}) {
    const data = await this.repository.find(query, options);
    return data;
  }

  async getById(id) {
    const data = await this.repository.findById(id);
    if (!data) {
      throw new AppError(`${this.resourceName} topilmadi`, 404);
    }
    return data;
  }

  async getOne(query = {}) {
    const data = await this.repository.findOne(query);
    if (!data) {
      throw new AppError(`${this.resourceName} topilmadi`, 404);
    }
    return data;
  }

  async create(data) {
    const newData = await this.repository.create(data);
    return newData;
  }

  async update(id, data) {
    const updatedData = await this.repository.update(id, data);
    if (!updatedData) {
      throw new AppError(`${this.resourceName} topilmadi yoki yangilanmadi`, 404);
    }
    return updatedData;
  }

  async delete(id) {
    const deletedData = await this.repository.delete(id);
    if (!deletedData) {
      throw new AppError(`${this.resourceName} topilmadi yoki o'chmadi`, 404);
    }
    return deletedData;
  }
  
  async count(query = {}) {
    return await this.repository.count(query)
  }
}

module.exports = BaseService;
