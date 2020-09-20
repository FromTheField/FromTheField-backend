import express from "express";
import Logger from "../../../core/Logger";

const router = express.Router();

router.post("/", async (req, res) => {
  Logger.info("signup route");
});

export default router;
