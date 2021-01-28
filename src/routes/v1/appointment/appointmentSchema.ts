import Joi from 'joi'

export default {
    new:Joi.object().keys({
        mentor_email:Joi.string().email().required(),
        time:Joi.date().iso().required(),
        info:Joi.string().required(),
    }),
}