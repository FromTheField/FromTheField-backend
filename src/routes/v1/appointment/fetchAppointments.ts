import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import AppointmentRepo from "../../../database/repository/AppointmentRepo";
import authentication from "../../../auth/authentication";
import { SuccessResponse } from "../../../core/ApiResponse";
import { ProtectedRequest } from "../../../types/app-request";
import { BadRequestError } from "../../../core/ApiError";
import validator, { ValidationSource } from "../../../helpers/validator";
import schema from './appointmentSchema'
import { Status } from "../../../database/models/appointment";

const router = express.Router();


router.use("/",authentication);


router.get(
    "/all",
    asyncHandler(async(req,res)=>{
        const appointments = await AppointmentRepo.fetchAll();

        new SuccessResponse("All Appointments",{
            appointments
        }).send(res);
    })
);

router.get(
    "/byMentee",
    asyncHandler(async(req:ProtectedRequest,res)=>{
        const mentee = req.user;
        if(mentee.isMentor) throw new BadRequestError("Logged in user is not a mentee");

        const appointments = await AppointmentRepo.fetchByMentee(mentee);

        new SuccessResponse("All Appointments",{
            appointments
        }).send(res);
    })
);

router.get(
    "/byMentor",
    asyncHandler(async(req:ProtectedRequest,res)=>{
        const mentor = req.user;
        if(!mentor.isMentor) throw new BadRequestError("Logged in user is not a mentor");

        const appointments = await AppointmentRepo.fetchByMentor(mentor);

        new SuccessResponse("All Appointments",{
            appointments
        }).send(res);
    })
);

router.get(
    "/byMentee/:status",
    validator(schema.byStatus,ValidationSource.PARAM),
    asyncHandler(async(req:ProtectedRequest,res)=>{
        const mentee = req.user;
        if(mentee.isMentor) throw new BadRequestError("Logged in user is not a mentee");

        const appStatus:Status = req.params.status as Status;
        const appointments = await AppointmentRepo.fetchByMenteeAndStatus(mentee,appStatus);

        new SuccessResponse("All Appointments",{
            appointments
        }).send(res);
    })
);





router.get(
    "/byMentor/:status",
    validator(schema.byStatus,ValidationSource.PARAM),
    asyncHandler(async(req:ProtectedRequest,res)=>{
        const mentor = req.user;
        if(!mentor.isMentor) throw new BadRequestError("Logged in user is not a mentor");

        const appStatus:Status = req.params.status as Status;
        const appointments = await AppointmentRepo.fetchByMentorAndStatus(mentor,appStatus);

        new SuccessResponse("All Appointments",{
            appointments
        }).send(res);
    })
);

export default router;
