import express from "express";
import newAppointment from './newAppointment'
import fetchAppointment from './fetchAppointments'
import editStatusAppointment from './editStatus'

const router = express.Router();

router.use("/new",newAppointment);
router.use("/fetch",fetchAppointment);
router.use("/editStatus",editStatusAppointment);

export default router;
