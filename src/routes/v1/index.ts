import express from "express";
import login from "./mentee/login";
import signup from "./mentee/signup";

const router = express.Router();

router.use("/signup", signup);
router.use("/login", login);

export default router;
