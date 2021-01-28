import express from "express";
import asyncHandler from "../../../helpers/asyncHandler";
import { SuccessResponse } from "../../../core/ApiResponse";
import { BadRequestError, AuthFailureError } from "../../../core/ApiError";
import bcrypt from "bcryptjs";
import _ from "lodash";
import validator from "../../../helpers/validator";
import schema from "./schema";
import crypto from "crypto";
import KeystoreRepo from "../../../database/repository/KeyStoreRepo";
import { createTokens } from "../../../auth/authUtils";
import UserRepo from "../../../database/repository/UserRepo";

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

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    await KeystoreRepo.create(user,accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user._id, accessTokenKey, refreshTokenKey);

    new SuccessResponse("Login Success", {
      user: _.pick(user, ["_id", "name", "email", "password"]),
      tokens,
    }).send(res);
  })
);

export default router;
