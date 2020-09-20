import express from "express";
import Logger from "../../../core/Logger";

const router = express.Router();

router.post("/basic", async (req, res) => {
  Logger.info("basic Login");
});

export default router;
