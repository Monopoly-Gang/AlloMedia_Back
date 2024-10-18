const e = require('express');
const Joi = require('joi');
const createRestoValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        cuisineType: Joi.string().min(3).required(),
        address: Joi.string().min(10).required(),
        location: Joi.string().min(3).required(),
        banner: Joi.string().uri().regex(/\.(jpeg|jpg|gif|png)$/).optional(),
        logo: Joi.string().uri().regex(/\.(jpeg|jpg|gif|png)$/).optional(),        
        manager: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), // Validating MongoDB ObjectId
        isApproved: Joi.boolean().optional(),
        menu: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional() // Ensure menu items are ObjectIds
    });

    return schema.validate(data);
};

module.exports = { createRestoValidation };