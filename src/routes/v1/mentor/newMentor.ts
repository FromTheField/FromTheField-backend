

import express from "express";
import asyncHandler from "../../../helpers/asyncHandler";
import { SuccessResponse } from "../../../core/ApiResponse";
import { BadRequestError, AuthFailureError } from "../../../core/ApiError";
import bcrypt from "bcryptjs";
import _ from "lodash";
import validator from "../../../helpers/validator";
import schema from "./mentorSchema";
import crypto from "crypto";
import { createTokens } from "../../../auth/authUtils";
import UserRepo from "../../../database/repository/UserRepo";
import User from "../../../database/models/User";

const router = express.Router();

router.post(
  "/",
  validator(schema.new),
  asyncHandler(async (req, res) => {

    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError("Already Registered.Please Login");

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    const salt = bcrypt.genSaltSync(10);
    const hashPwd = bcrypt.hashSync(req.body.password, salt);
    //Debug
    // Logger.info(`Current Role is: ${req.params.role}`);
    const { user: createdUser, keystore } = await UserRepo.create(
      {
        name: req.body.name,
        password: hashPwd,
        email: req.body.email,
        org:req.body.org,
        isMentor:true,
      }  as User,
      accessTokenKey,
      refreshTokenKey
    );
    const tokens = await createTokens(
      createdUser._id,
      keystore.primaryKey,
      keystore.secondarKey
    );

    new SuccessResponse("Signup Success", {
      user: createdUser,
      tokens,
    }).send(res);
  })
);

export default router;
