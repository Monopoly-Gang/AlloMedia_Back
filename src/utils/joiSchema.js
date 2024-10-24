const Joi = require('joi');
const { min } = require('lodash');

const schemas = {
    fullName: Joi
        .string()
        .min(3)
        .max(30)
        .lowercase()
        .required()
        .messages({
            'string.min': 'FullName must be at least 3 characters long',
            'string.max': 'FullName must be at most 30 characters long',
            'string.empty': 'FullName is not allowed to be empty',
            'any.required': 'FullName is required'
        }),
    email: Joi
        .string()
        .email()
        .required()
        .messages({
            'string.pattern.base': 'Email must be a valid email',
            'string.empty': 'Email is not allowed to be empty',
            'any.required': 'Email is required',
            'string.email': 'Email must be a valid email'
        }),
    password: Joi
        .string()
        .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one number',
            'string.empty': 'Password is not allowed to be empty',
            'any.required': 'Password is required'
        }),
    phoneNumber: Joi
        .string()
        .pattern(new RegExp('^\\+\\d{1,3}\\d{4,14}$'))
        .required()
        .messages({
            'string.pattern.base': 'Phone number must be in international format',
            'string.empty': 'Phone number is not allowed to be empty',
            'any.required': 'Phone number is required'
        }),
    address: Joi.string().required().messages({
        'string.empty': 'Address is not allowed to be empty',
        'any.required': 'Address is required'
    }),
    otp: Joi.string()
        .required()
        .pattern(new RegExp('^[0-9]{4}$'))
        .messages({
        'string.empty': 'OTP is not allowed to be empty',
        'any.required': 'OTP is required',
        'string.pattern.base': 'OTP must be a 4-digit number'
    }),
    name: Joi.string().required().lowercase().min(3).max(20).messages({
        'string.min': 'name must be at least 3 characters long',
        'string.max': 'name must be at most 30 characters long',
        'string.empty': 'name is not allowed to be empty',
        'any.required': 'name is required'
    }),
    cuisineType: Joi.string().required().messages({
        'string.empty': 'cuisineType is not allowed to be empty',
        'any.required': 'cuisineType is required'
    }),

    location: Joi.string().min(3).required().messages({
        'string.min': 'location must be at least 3 characters long',
        'string.empty': 'location is not allowed to be empty',
        'any.required': 'location is required'
    }),
    banner: Joi.string().regex(/\.(jpeg|jpg|gif|png)$/).optional(),
    logo: Joi.string().regex(/\.(jpeg|jpg|gif|png)$/).optional(),        
    manager: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), // Validating MongoDB ObjectId
    isApproved: Joi.boolean().optional(),
    menu: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional() 

    
    

};

module.exports = (...fields) => {
    const genSchema = {};
    fields.forEach(field => genSchema[field] = schemas[field] || Joi.string().required());
    return Joi.object(genSchema);
}
