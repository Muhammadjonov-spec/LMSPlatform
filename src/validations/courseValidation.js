const Joi = require('joi');

const createCourseSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(20).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(), // Category ID
  thumbnail: Joi.string().uri().optional()
});

const addModuleSchema = Joi.object({
  moduleTitle: Joi.string().min(3).required()
});

const addLessonSchema = Joi.object({
  title: Joi.string().min(3).required(),
  videoUrl: Joi.string().required() 
});

module.exports = {
  createCourseSchema,
  addModuleSchema,
  addLessonSchema
};
