import express from "express";
import login from "./access/login";
import signup from "./access/signup";

const router = express.Router();

router.use("/signup", signup);
router.use("/login", login);

export default router;
