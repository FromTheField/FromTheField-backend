import express from "express";
import asyncHandler from "../../../helpers/asyncHandler";
import { SuccessResponse } from "../../../core/ApiResponse";
import { BadRequestError, AuthFailureError } from "../../../core/ApiError";
import bcrypt from "bcryptjs";
import _ from "lodash";
import validator from "../../../helpers/validator";
import schema from "./mentorSchema";
import crypto from "crypto";
import KeystoreRepo from "../../../database/repository/KeyStoreRepo";
import { createTokens } from "../../../auth/authUtils";
import MentorRepo from "../../../database/repository/MentorRepo";
import Logger from "../../../core/Logger";

const router = express.Router();

router.post(
  "/",
  validator(schema.login),
  asyncHandler(async (req, res) => {
    const user = await MentorRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError("Not Registered");
    if (!user.password) throw new BadRequestError("Password not set");

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError("Invalid password");

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    await KeystoreRepo.create(accessTokenKey, refreshTokenKey, user._id);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

    new SuccessResponse("Login Success", {
      user: _.pick(user, ["_id", "name", "email", "password", "rating"]),
      tokens,
    }).send(res);
  })
);

export default router;
