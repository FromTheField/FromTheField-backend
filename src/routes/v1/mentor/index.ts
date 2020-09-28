import express from "express";
import newMentor from "./newMentor";
import mentorLogin from "./mentorLogin";

const router = express.Router();

router.use("/new", newMentor);
router.use("/login", mentorLogin);

export default router;
