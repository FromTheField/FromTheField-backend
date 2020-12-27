import express from "express";
import asyncHandler from "../../../helpers/asyncHandler";
import UserRepo from "../../../database/repository/UserRepo";
import { SuccessResponse } from "../../../core/ApiResponse";
import { AuthFailureError, BadRequestError } from "../../../core/ApiError";
import _ from "lodash";
import validator from "../../../helpers/validator";
import schema from "./mentorSchema";
import { createTokens } from "../../../auth/authUtils";
import crypto from "crypto";
import KeystoreRepo from "../../../database/repository/KeyStoreRepo";
import bcrypt from "bcryptjs";
import User from "../../../database/models/User";

const router = express.Router();

interface props {
  start?: number;
  end?: number;
}

router.use(
  "/",
  validator(schema.login),
  asyncHandler(async (req, res) => {
    const {
      email,
      name,
      background,
      password,
      desc,
      phNum,
      location,
    } = req.body;

    if (background)
      background.forEach(({ start, end }: props) => {
        if (start > end)
          throw new BadRequestError("Invalid Years for the experience");
      });

      const user = await UserRepo.findByEmail(req.body.email);
      if (!user) throw new BadRequestError("Not Registered");
      if (!user.password) throw new BadRequestError("Password not set");

  

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError("Invalid password");


    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    await KeystoreRepo.create(user,accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user._id, accessTokenKey, refreshTokenKey);

    await KeystoreRepo.create(
      user,
      accessTokenKey,
      refreshTokenKey,
    );
 
    new SuccessResponse("Mentor Login Successful", {
      mentor: _.pick(user, [
        "_id",
        "name",
        "name",
        "background",
        "password",
        "desc",
        "phNum",
        "location",
      ]),
      tokens,
    }).send(res);
  })
);
export default router;
