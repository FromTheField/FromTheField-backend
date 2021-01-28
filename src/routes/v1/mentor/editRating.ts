import express from "express";
import asyncHandler from "../../../helpers/asyncHandler";
import { NoData, InternalError, ForbiddenError } from "../../../core/ApiError";
import { SuccessResponse, BadRequest } from "../../../core/ApiResponse";
import _ from "lodash";
import UserRepo from "../../../database/repository/UserRepo";
import authentication from "../../../auth/authentication";
import { ProtectedRequest } from "../../../types/app-request";
import validator from "../../../helpers/validator";
import schema from "./mentorSchema";
import Logger from "../../../core/Logger";
const router = express.Router();

router.post(
  "/",
  authentication,
  validator(schema.editRating),
  asyncHandler(async (req:ProtectedRequest, res) => {
    const { userRating, email } = req.body;
    if(req.user.isMentor)
      throw new ForbiddenError("Mentors can't assign rating to other mentors");
    if (userRating < 1 || userRating > 5)
      throw new BadRequest("Invalid Rating [1-5]");

    const mentor = await UserRepo.findByEmail(email);
    if (!mentor || !mentor.isMentor) throw new BadRequest("Mentor Does not Exist");
    if (!mentor.rating) throw new NoData(`Rating does not existfor ${name}`);

    mentor.rating[userRating - 1]++;

    const newMentor = await UserRepo.editRating(email, mentor.rating);
    if (newMentor.ok != 1)
      throw new InternalError(`Rating Update Failed for ${newMentor}`);

    let finalRating = 0;
    let star = 1;
    let numMentee = 0;
    mentor.rating.forEach((ele) => {
      finalRating = finalRating + star * ele;
      star++;
      numMentee += ele;
    });
    finalRating /= numMentee;

    new SuccessResponse("Update Sucessful", {
      rating: finalRating,
    }).send(res);
  })
);

export default router;
