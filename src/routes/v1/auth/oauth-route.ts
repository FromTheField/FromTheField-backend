// For Rendering Google Account

import { NextFunction, Request, Response } from "express";
import express from 'express'
import passport from 'passport'
import User, {UserModel} from '../../../database/models/User'
import isLoggedIn from '../../../middlewares/isloggedin'

const router = express.Router();

router.get('/auth/google', passport.authenticate("google", { scope: ['profile', 'email'] }) );

router.get('/auth/google/redirect', passport.authenticate('google'), async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore  
    let user = req.user
    console.log("Authenticated : ",req.isAuthenticated())// @ts-ignore  
    console.log(user)// @ts-ignore  
    var email = user.email
    res.send(user);
});

router.get('/update/userstatus/mentor', isLoggedIn,async (req: Request, res: Response) => {
  const {background, desc, phNum, location, isMentor, org, createdAt, updatedAt} = req.body;
  // @ts-ignore
  const check = await UserModel.findOne({_id : req.user._id})

  if (check){
    check.background = background;
    check.desc = desc;
    check.phNum = phNum;
    check.location = location;
    check.isMentor = isMentor ;
    check.org = org;
    check.createdAt = createdAt;
    check.updatedAt = updatedAt;

    await check.save();

    res.send(check);
  } else 
        res.send("User Not Found !");

})


export default router;
