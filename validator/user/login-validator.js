const Joi = require("joi");

function validateUserDetail(userObject) {
  const schema = Joi.object({
    email: Joi.string().trim().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(3).max(80).required(),
  });
  return schema.validate(userObject);
}

module.exports = validateUserDetail;
