// For Rendering Google Account

import { NextFunction, Request, Response } from "express";
import express from 'express'
import passport from 'passport'

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


export default router;
