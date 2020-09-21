import express from "express";
import Logger from "../../../core/Logger";
import asyncHandler from "../../../helpers/asyncHandler";
import UserRepo from "../../../database/repository/UserRepo";
import { BadRequest, SuccessResponse } from "../../../core/ApiResponse";
import { BadRequestError, AuthFailureError } from "../../../core/ApiError";
import bcrypt from "bcryptjs";
import _ from "lodash";
import validator from "../../../helpers/validator";
import schema from "./schema";

const router = express.Router();

router.post(
  "/basic",
  validator(schema.login),
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError("User Not Registered");
    if (!user.password) throw new BadRequestError("Password not set");

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError("Invalid password");

    new SuccessResponse("Login Success", {
      user: _.pick(user, ["_id", "name", "email", "password"]),
    }).send(res);
  })
);

export default router;
