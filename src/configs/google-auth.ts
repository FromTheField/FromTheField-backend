import passport from 'passport'
import mongoose from 'mongoose'
import * as jwt from 'jsonwebtoken'
// import { GoogleCallbackParameters, Profile } from 'passport-google-oauth20';
import User, {UserModel} from '../database/models/User'
require('dotenv').config();
import {Strategy} from 'passport-google-oauth20'

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});


passport.deserializeUser((id: any, done: any) => {
  UserModel.findById(id).then((user: User) => {
      done(null, user);
  });
});


passport.use(
  new Strategy({
      clientID: "410686642654-m51ag7b9u79lft9jhb1d4ouh7ni341er.apps.googleusercontent.com",
      clientSecret: "FIaI75DfaQs4Jg3zLp3VvrWF",
      callbackURL: '/auth/google/redirect'
  }, (accessToken: any, refreshToken: any, profile: any, done: any) => {
      UserModel.findOne({
          googleId: profile.id
      }).then((currentUser: User) => {
          if (currentUser) {
              console.log('user is: ', currentUser);
              const token = jwt.sign({
                  _id : currentUser._id ,
                  name : currentUser.name,
                  email : currentUser.email,
              }, "process.env.JWTTOKEN", {expiresIn:"1d"})

              UserModel.findById(currentUser._id).then((check) => {
                  check.token = token    
                  check.googleId = profile.id,
                  check.save().then((user) => {
                      console.log('user is: ', currentUser);
                      done(null, user)
                  }).catch((e) => console.log(e))
              })
              // done(null, currentUser);
          } else {
              new UserModel({
                  _id: new mongoose.Types.ObjectId(),
                  googleId: profile.id,
                  name: profile.displayName,
                  email: profile._json.email,
              }).save().then((newUser) => {
                  
                const token = jwt.sign({
                      _id : newUser._id,
                      name: newUser.name,
                      email: newUser.email,
                  }, "process.env.JWTTOKEN", {expiresIn: "1d"})


                UserModel.findById(newUser._id).then((check: User) => {
                      check.token = token
                      check.save().then((user) => {console.log('created new user: ', newUser);
                      done(null, user)}).catch((e) => console.log(e)).catch((e) => console.log(e))
                  })
                  // console.log('created new user: ', newUser);
                  // done(null, newUser);
              });
          }
      });
  })
);
