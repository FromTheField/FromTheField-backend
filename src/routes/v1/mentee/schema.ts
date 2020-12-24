import Joi from "joi";

export default {
  login: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(1),
  }),
  signup: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(1),
    org:Joi.string().required().min(1),
    name:Joi.string().required().min(1),
    website:Joi.string().uri()
  }),
  getProfile: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
