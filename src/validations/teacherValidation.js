const Joi = require('joi');

const applyTeacherSchema = Joi.object({
  bio: Joi.string().min(20).required(),
  expertise: Joi.array().items(Joi.string()).min(1).required(),
  experienceYears: Joi.number().min(0).required(),
  socialLinks: Joi.object({
    youtube: Joi.string().uri().optional().allow(''),
    linkedin: Joi.string().uri().optional().allow(''),
    github: Joi.string().uri().optional().allow(''),
    website: Joi.string().uri().optional().allow('')
  }).optional()
});

module.exports = {
  applyTeacherSchema
};
