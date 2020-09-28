import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import MentorRepo from "../../../database/repository/MentorRepo";
import { BadRequestError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const mentor = await MentorRepo.findByEmail(req.body.email);
    if (!mentor) throw new BadRequestError("Mentor does not exist");

    new SuccessResponse("Mentor", {
      mentor,
    }).send(res);
  })
);

export default router;
