import express from "express";
import login from "./mentee/login";
import signup from "./mentee/signup";
import mentorModule from "./mentor";
import getProfile from "./mentee/getProfile";
const router = express.Router();

router.use("/signup", signup);
router.use("/login", login);
router.use("/getProfile", getProfile);
router.use("/mentor", mentorModule);


export default router;
