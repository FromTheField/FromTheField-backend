import express from "express";
import login from "./mentee/login";
import signup from "./mentee/signup";
import mentorModule from "./mentor";
import getProfile from "./mentee/getProfile";
import appointmentModule from './appointment'
const router = express.Router();

router.use("/signup", signup);
router.use("/login", login);
router.use("/getProfile", getProfile);
router.use("/mentor", mentorModule);
router.use("/appointment",appointmentModule);


export default router;
