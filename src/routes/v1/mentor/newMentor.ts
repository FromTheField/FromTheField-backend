import express from "express";
import asyncHandler from "../../../helpers/asyncHandler";
import MentorRepo from "../../../database/repository/MentorRepo";
import { SuccessResponse } from "../../../core/ApiResponse";
import { BadRequestError } from "../../../core/ApiError";
import _ from "lodash";
import validator from "../../../helpers/validator";
import schema from "./mentorSchema";
import { createTokens } from "../../../auth/authUtils";
import crypto from "crypto";
import KeystoreRepo from "../../../database/repository/KeyStoreRepo";
import bcrypt from "bcryptjs";

const router = express.Router();

interface props {
  start?: number;
  end?: number;
}

router.use(
  "/",
  validator(schema.new as any),
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

    const mentor = await MentorRepo.findByEmail(email);
    if (mentor) throw new BadRequestError("Mentor already exists");

    const salt = bcrypt.genSaltSync(10);
    const hashPwd = bcrypt.hashSync(password, salt);

    const createdMentor = await MentorRepo.create(
      email,
      name,
      background,
      hashPwd,
      desc,
      phNum,
      location
    );
    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    await KeystoreRepo.create(
      accessTokenKey,
      refreshTokenKey,
      createdMentor._id
    );
    const tokens = await createTokens(
      createdMentor._id,
      accessTokenKey,
      refreshTokenKey
    );
    new SuccessResponse("Mentor Registration Successful", {
      mentor: _.pick(createdMentor, [
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
