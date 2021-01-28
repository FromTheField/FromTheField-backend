import express from "express";
import newMentor from "./newMentor";
import mentorLogin from "./mentorLogin";
import editRating from "./editRating";
import getMentor from "./getMentor";

const router = express.Router();

router.use("/fetch", getMentor);
router.use("/new", newMentor);
router.use("/login", mentorLogin);
router.use("/editRating", editRating);


export default router;
