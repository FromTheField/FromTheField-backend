import express from "express";
import newMentor from "./newMentor";
import mentorLogin from "./mentorLogin";
import editRating from "./editRating";

const router = express.Router();

router.use("/new", newMentor);
router.use("/login", mentorLogin);
router.use("/editRating", editRating);

export default router;
