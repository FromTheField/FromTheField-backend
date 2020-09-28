import express from "express";
import asyncHandler from "../../../helpers/asyncHandler";
import { SuccessResponse, BadRequest } from "../../../core/ApiResponse";
import { MentorModel } from "../../../database/models/mentor";
import MentorRepo from "../../../database/repository/MentorRepo";
import validator from "../../../helpers/validator";
import schema from "./mentorSchema";
const router = express.Router();

router.get(
  "/",
  validator(schema.getRating),
  asyncHandler(async (req, res) => {
    const mentor = await MentorRepo.findByEmail(req.body.email);
    if (!mentor) throw new BadRequest("Mentor Does Not Exist");

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

export default router;
