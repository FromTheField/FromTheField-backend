import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import validator, { ValidationSource } from "../../../helpers/validator";
import schema from './appointmentSchema'
import { Status } from "../../../database/models/appointment";
import AppointmentRepo from "../../../database/repository/AppointmentRepo";
import { Types } from "mongoose";
import { SuccessMsgResponse } from "../../../core/ApiResponse";
import { BadRequestError, InternalError } from "../../../core/ApiError";
import Logger from "../../../core/Logger";
const router = express.Router();

router.put(
    "/:id",
    validator(schema.byID,ValidationSource.PARAM),
    validator(schema.byStatus),
    asyncHandler(async (req,res)=>{
        const {status} = req.body;
        const appStatus:Status = status;
        const appId:Types.ObjectId = new Types.ObjectId(req.params.id);
        const appointment = await AppointmentRepo.finById(appId)
        if(!appointment) throw new BadRequestError(`No such appointment with id ${appId}`);
        Logger.info(appStatus)

        try {
            await AppointmentRepo.editStatus(appointment,appStatus);
            new SuccessMsgResponse("Successfully updated status").send(res);
        }catch(err) {
            throw new InternalError(`Failed to update status: ${err}`);
        }
    })
)

export default router;
