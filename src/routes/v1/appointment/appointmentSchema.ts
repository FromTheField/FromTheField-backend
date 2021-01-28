import Joi from 'joi'
import {Status} from '../../../database/models/appointment'
import { JoiObjectId } from '../../../helpers/validator'
export default {
    new:Joi.object().keys({
        mentor_email:Joi.string().email().required(),
        time:Joi.date().iso().required(),
        info:Joi.string().required(),
    }),
    byStatus:Joi.object().keys({
        status:Joi.string().valid(Status.CONFIRMED,Status.PENDING,Status.CANCELLED).required()
    }),
    byID:Joi.object().keys({
        id:JoiObjectId().required()
    }),
}