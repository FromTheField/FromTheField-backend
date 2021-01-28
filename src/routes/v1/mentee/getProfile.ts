import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import { BadRequestError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";
import validator from "../../../helpers/validator";
import schema from "./schema";
import UserRepo from "../../../database/repository/UserRepo";

const router = express.Router();

router.get(
  "/",
  validator(schema.getProfile),
  asyncHandler(async (req, res) => {
    const mentee = await UserRepo.findByEmail(req.body.email);
    if (!mentee) throw new BadRequestError("No Mentee Profile Exists");

    new SuccessResponse("Mentee", {
      mentee,
    }).send(res);
  })
);

export default router;
