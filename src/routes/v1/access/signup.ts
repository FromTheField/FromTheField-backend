import express from "express";
import Logger from "../../../core/Logger";
import asyncHandler from "../../../helpers/asyncHandler";
import UserRepo from "../../../database/repository/UserRepo";
import { BadRequestError } from "../../../core/ApiError";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) return new BadRequestError("User Nor Found");
  })
);

export default router;
