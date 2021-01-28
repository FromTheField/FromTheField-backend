import express from "express";
import newAppointment from './newAppointment'

const router = express.Router();

router.use("/new",newAppointment)

export default router;
