import express from "express";
import asyncHandler from "../../../helpers/asyncHandler";
import MentorRepo from "../../../database/repository/MentorRepo";
import { NoData, InternalError } from "../../../core/ApiError";
import { SuccessResponse, BadRequest } from "../../../core/ApiResponse";
import _ from "lodash";
const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { userRating, email } = req.body;

    if (userRating < 1 || userRating > 5)
      throw new BadRequest("Invalid Rating [1-5]");

    const mentor = await MentorRepo.findByEmail(email);
    if (!mentor) throw new BadRequest("Mentor Does not Exist");
    if (!mentor.rating) throw new NoData(`Rating does not existfor ${name}`);

    mentor.rating[userRating - 1]++;

    const newMentor = await MentorRepo.editRating(email, mentor.rating);
    if (newMentor.ok != 1)
      throw new InternalError(`Rating Update Failed for ${newMentor}`);

    new SuccessResponse("Update Sucessful", {
      rating: mentor.rating,
    }).send(res);
  })
);

export default router;
