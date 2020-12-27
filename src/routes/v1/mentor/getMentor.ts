import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import MentorRepo from "../../../database/repository/MentorRepo";
import { BadRequestError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";
import authentication from "../../../auth/authentication";
import { ProtectedRequest } from "../../../types/app-request";

const router = express.Router();

router.use("/",authentication);


router.get(
  "/:id",
  asyncHandler(async (req:ProtectedRequest, res) => {
    const mentor = await MentorRepo.findByEmail(req.user.email);
    if (!mentor) throw new BadRequestError("Mentor does not exist");

    new SuccessResponse("Mentor", {
      mentor,
    }).send(res);
  })
);

export default router;
