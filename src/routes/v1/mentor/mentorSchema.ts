import Joi from "@hapi/joi";

export default {
  new: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required().min(1),
    background: Joi.array()
      .items({
        title: Joi.string().required(),
        place: Joi.string().required(),
        start: Joi.number().integer().positive().required(),
        end: Joi.number().integer().positive().required(),
      })
      .required(),
    password: Joi.string().required().min(3),
    desc: Joi.string().required().min(3),
    phNum: Joi.string().required(),
    location: Joi.string().required(),
  }),
  login: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  editRating: Joi.object().keys({
    userRating: Joi.number().integer().min(1).max(5).required(),
    email: Joi.string().email().required(),
  }),
};
