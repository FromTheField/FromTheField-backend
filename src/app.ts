import express from "express";
import cors from "cors";
import { corsUrl } from "./config";
import Logger from "./core/Logger";
import routesV1 from "./routes/v1";

const app = express();

process.on("uncaughtException", (e) => {
  Logger.error(e);
});

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "10mb", parameterLimit: 50000 })
);
app.use(cors({ origin: corsUrl }));

app.use("/v1", routesV1);

//error handlig

export default app;
