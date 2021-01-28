import express from "express";
import newAppointment from './newAppointment'
import fetchAppointment from './fetchAppointments'

const router = express.Router();

router.use("/new",newAppointment);
router.use("/fetch",fetchAppointment);

export default router;
