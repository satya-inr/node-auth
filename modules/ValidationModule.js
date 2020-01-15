const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().required().email().messages({ "string.empty": `Email is required`, "string.email": `Invalid Email` }),
        password: Joi.string().required().min(6).messages({
            "string.empty": `Password is required`, "string.min": `Password should have a minimum length of {#limit}`,
            "string.max": `"Password" should have a maximum length of {#limit}`
        })
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email().messages({ "string.empty": `Email is required`, "string.email": `Invalid Email` }),
        password: Joi.string().required().min(6).messages({
            "string.empty": `Password is required`, "string.min": `Password should have a minimum length of {#limit}`,
            "string.max": `"Password" should have a maximum length of {#limit}`
        })
    });
    return schema.validate(data);
}

const postValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({ "string.empty": `Title is required` }),
        description: Joi.string().required().messages({ "string.empty": `Description is required` })
    })
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;