const Joi = require('joi');

const menuItemValidationSchema = Joi.object({
  name: Joi.string().min(1).required()
    .messages({
      'string.base': `"name" should be a type of 'text'`,
      'string.empty': `"name" cannot be an empty field`,
      'any.required': `"name" is a required field`
    }),
  description: Joi.string().allow(null, '').optional(),
  price: Joi.number().greater(0).required()
    .messages({
      'number.base': `"price" should be a type of 'number'`,
      'number.greater': `"price" should be greater than 0`,
      'any.required': `"price" is a required field`
    }),
  image: Joi.string().optional()
    .messages({
      'string.uri': `"image" should be a valid URL`
    }),
});

const validateRestaurantId = (id) => {
  return Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    .messages({
      'string.pattern.base': `"restaurant" should be a valid MongoDB ObjectId`,
      'any.required': `"restaurant" is a required field`
    });
};
const UpdatemenuItemValidationSchema = Joi.object({
  name: Joi.string().min(1).optional()
    .messages({
      'string.base': `"name" should be a type of 'text'`,
      'string.empty': `"name" cannot be an empty field`,
      'any.required': `"name" is a required field`
    }),
  description: Joi.string().allow(null, '').optional(),
  price: Joi.number().greater(0).optional()
    .messages({
      'number.base': `"price" should be a type of 'number'`,
      'number.greater': `"price" should be greater than 0`,
      'any.required': `"price" is a required field`
    }),
  _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': `"id" should be a valid MongoDB ObjectId`,
      'any.required': `"id" is a required field`
    }),
    image: Joi.string().optional()
    .messages({
      'string.uri': `"image" should be a valid URL`
    }),
});
const DeleteMenuItemValidationSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    .messages({
      'string.pattern.base': `"id" should be a valid MongoDB ObjectId`,
      'any.required': `"id" is a required field`
    })
});

module.exports = { menuItemValidationSchema, UpdatemenuItemValidationSchema ,DeleteMenuItemValidationSchema};
