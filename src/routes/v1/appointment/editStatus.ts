import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import validator, { ValidationSource } from "../../../helpers/validator";
import schema from './appointmentSchema'
import { Status } from "../../../database/models/appointment";
import AppointmentRepo from "../../../database/repository/AppointmentRepo";
import { Types } from "mongoose";
import {  SuccessResponse } from "../../../core/ApiResponse";
import { BadRequestError, InternalError } from "../../../core/ApiError";
const router = express.Router();

router.put(
    "/:id",
    validator(schema.byID,ValidationSource.PARAM),
    validator(schema.byStatus),
    asyncHandler(async (req,res)=>{
        const {status} = req.body;
        const appStatus:Status = status;
        const appId:Types.ObjectId = new Types.ObjectId(req.params.id);
        const appointment = await AppointmentRepo.findById(appId)
        if(!appointment) throw new BadRequestError(`No such appointment with id ${appId}`);
        if(appointment.status === Status.CONFIRMED && appStatus === Status.CONFIRMED) throw new BadRequestError(`Appointment already confirmed and scheduled`);
        try {
           const app = await AppointmentRepo.editStatus(appointment,appStatus);
            new SuccessResponse("Successfully updated status",{
                app
            }).send(res);
        }catch(err) {
            throw new InternalError(`Failed to update status: ${err}`);
        }
    })
)

export default router;
