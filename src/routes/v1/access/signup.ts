import express from "express";
import Logger from "../../../core/Logger";
import asyncHandler from "../../../helpers/asyncHandler";
import User from "../../../database/models/user";
import UserRepo from "../../../database/repository/UserRepo";
import { BadRequestError } from "../../../core/ApiError";
import brcrypt from "bcryptjs";
import { RoleCode } from "../../../database/models/role";
import { SuccessResponse } from "../../../core/ApiResponse";
import _ from "lodash";

const router = express.Router();

router.post(
  "/:role",
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) return new BadRequestError("User Already Registered");

    const salt = brcrypt.genSaltSync(10);
    const hashPwd = brcrypt.hashSync(req.body.password, salt);
    //Debug
    Logger.info(`Current Role is: ${req.params.role}`);
    const { user: createdUser } = await UserRepo.create(
      ({
        name: req.body.name,
        password: hashPwd,
        email: req.body.email,
      } as unknown) as User,
      req.params.role as RoleCode
    );
    return new SuccessResponse("Signup Successful", {
      user: _.pick(createdUser, ["_id", "name", "email", "roles"]),
    }).send(res);
  })
);

export default router;
