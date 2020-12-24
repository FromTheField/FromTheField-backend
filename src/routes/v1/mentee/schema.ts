import Joi from "@hapi/joi";

export default {
  login: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(1),
  }),
  signup: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(1),
  }),
  getProfile: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
