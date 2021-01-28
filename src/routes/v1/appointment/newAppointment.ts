import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import validator from "../../../helpers/validator";
import schema from './appointmentSchema'
import { ProtectedRequest } from "../../../types/app-request";
import authentication from "../../../auth/authentication";
import AppointmentRepo from "../../../database/repository/AppointmentRepo";
import UserRepo from "../../../database/repository/UserRepo";
import { BadRequest, SuccessResponse } from "../../../core/ApiResponse";
import Appointment from "../../../database/models/appointment";
import Logger from "../../../core/Logger";
import { BadRequestError } from "../../../core/ApiError";
const router = express.Router();

router.use("/",authentication);

router.post(
    "/",
    validator(schema.new),
    asyncHandler(async (req:ProtectedRequest,res)=>{
        const {mentor_email,time,info} = req.body;

        const mentor = await UserRepo.findByEmail(mentor_email);
        if(!mentor || !mentor.isMentor) throw new BadRequestError("Email does not belong to a registered mentor");
        
        const timeJS = new Date(time);

        const exists = await AppointmentRepo.findByMentorMenteeTime(req.user,mentor,time);
        if(exists) throw new BadRequestError("Appointment has already been scheduled");

        const createdAppointment = await AppointmentRepo.create({
            mentee:req.user,
            mentor,
            time:timeJS,
            info,
        } as Appointment);
        new SuccessResponse("Successfully scheduled appointment",{
            appointment:createdAppointment,
        }).send(res);
    })
)

export default router;
