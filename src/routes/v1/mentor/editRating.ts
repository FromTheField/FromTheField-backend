import express from "express";
import asyncHandler from "../../../helpers/asyncHandler";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {})
);

export default router;
