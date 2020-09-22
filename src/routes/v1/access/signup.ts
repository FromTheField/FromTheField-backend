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
import validator from "../../../helpers/validator";
import schema from "./schema";
import crypto from "crypto";

const router = express.Router();

router.post(
  "/:role",
  validator(schema.signup),
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError("User Already Registered");

    const access_token = crypto.randomBytes(64).toString("hex");
    const refresh_token = crypto.randomBytes(64).toString("hex");

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
      access_token,
      refresh_token,
      req.params.role as RoleCode
    );
    new SuccessResponse("Signup Successful", {
      user: _.pick(createdUser, ["_id", "name", "email", "roles"]),
    }).send(res);
  })
);

export default router;
