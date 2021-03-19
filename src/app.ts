import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import { corsUrl, environment } from "./config";
import Logger from "./core/Logger";
import "./database";
import routesV1 from "./routes/v1";
import { NotFoundError, ApiError, InternalError } from "./core/ApiError";
import passport from 'passport'

const flash = require('connect-flash')

const app = express();


require('./configs/google-auth')
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());  

process.on("uncaughtException", (e) => {
  Logger.error(e);
});

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "10mb", parameterLimit: 50000 })
);
app.use(cors({ origin: corsUrl }));

import auth from './routes/v1/auth/oauth-route'
app.use("", auth);
app.use("/v1", routesV1);



//error handline
// app.use((req, res, next) => next(new NotFoundError("Route does not Exist")));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment == "development") {
      Logger.error(err);
      return res.status(500).send(err.message);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
