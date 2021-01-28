import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import { BadRequestError, NoData } from "../../../core/ApiError";
import { BadRequest, SuccessResponse } from "../../../core/ApiResponse";
import authentication from "../../../auth/authentication";
import { ProtectedRequest } from "../../../types/app-request";
import UserRepo from "../../../database/repository/UserRepo";
import validator, { ValidationSource } from "../../../helpers/validator";

import schema from './mentorSchema'
import Logger from "../../../core/Logger";
const router = express.Router();

router.use("/",authentication);

router.get(
  "/all",
  asyncHandler(async (req:ProtectedRequest, res) => {
    Logger.info("hello");
    const mentor = await UserRepo.fetchAllMentors();
    if (!mentor) throw new BadRequestError("Mentor does not exist");

    new SuccessResponse("Mentor", {
      mentor,
    }).send(res);
  })
);

router.get(
  "/rating/:id",
  validator(schema.byId,ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const mentor = await UserRepo.findById(req.params.id);
    if (!mentor || !mentor.isMentor) throw new BadRequestError("Mentor Does Not Exist");
    if(!mentor.rating) throw new NoData("Mentor has not been set rating: set default rating to this mentor")
    let finalRating = 0;
    let star = 1;
    let numMentee = 0;
    mentor.rating.forEach((ele) => {
      finalRating = finalRating + star * ele;
      star++;
      numMentee += ele;
    });
    finalRating /= numMentee;

    new SuccessResponse("Rating", {
      rating: finalRating,
      name: mentor.name,
      email: mentor.email,
    }).send(res);
  })
);

router.get(
  "/:id",
  validator(schema.byId,ValidationSource.PARAM),
  asyncHandler(async (req:ProtectedRequest, res) => {
    const mentor = await UserRepo.findById(req.params.id);
    if (!mentor || !mentor.isMentor) throw new BadRequestError("Mentor does not exist");
    new SuccessResponse("Mentor", {
      mentor,
    }).send(res);
  })
);


export default router;
