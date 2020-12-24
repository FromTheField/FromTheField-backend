import express from "express";
import Logger from "../../../core/Logger";
import asyncHandler from "../../../helpers/asyncHandler";
import User from "../../../database/models/mentee";
import UserRepo from "../../../database/repository/MenteeRepo";
import { BadRequestError } from "../../../core/ApiError";
import brcrypt from "bcryptjs";
import { RoleCode } from "../../../database/models/role";
import { SuccessResponse } from "../../../core/ApiResponse";
import _ from "lodash";
import validator from "../../../helpers/validator";
import schema from "./schema";
import crypto from "crypto";
import { createTokens } from "../../../auth/authUtils";
import { RoleRequest } from "../../../types/app-request";

const router = express.Router();

router.post(
  "/",
  validator(schema.signup),
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError("User Already Registered");

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    const salt = brcrypt.genSaltSync(10);
    const hashPwd = brcrypt.hashSync(req.body.password, salt);
    //Debug
    Logger.info(`Current Role is: ${req.params.role}`);
    const { user: createdUser, keystore } = await UserRepo.create(
      ({
        name: req.body.name,
        password: hashPwd,
        email: req.body.email,
        org:req.body.org
      } as unknown) as User,
      accessTokenKey,
      refreshTokenKey
    );
    const tokens = await createTokens(
      createdUser,
      keystore.primaryKey,
      keystore.secondarKey
    );

    new SuccessResponse("Signup Successful", {
      user: _.pick(createdUser, ["_id", "name", "email", "roles"]),
      tokens,
    }).send(res);
  })
);

export default router;
