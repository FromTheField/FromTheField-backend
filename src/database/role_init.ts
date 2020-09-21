import mongoose from "mongoose";
import Logger from "../core/Logger";
import { db, environment } from "../config";
import { RoleModel } from "./models/role";
// Build the connection string
const dbURI: string = environment === "development" ? db.dev : db.prod;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

// Create the database connection
mongoose
  .connect(dbURI, options)
  .then(() => {
    Logger.info("Adding role db...");
  })
  .catch((e) => {
    Logger.info("Failed to add to role db");
    Logger.error(e);
  });

const now: Date = new Date();
const roles: string[] = ["mentee", "admin", "mentor"];
const dbInput = roles.map((ele) => {
  return {
    code: ele,
    status: true,
    createdAt: now,
    updatedAt: now,
  };
});
RoleModel.insertMany(dbInput)
  .then(() => Logger.info("Successful insertion. press crtl/cmd+c to end"))
  .catch(() => Logger.error("db nisertion failed"));
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", () => {
  Logger.info("Mongoose default connection open to " + dbURI);
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  Logger.error("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  Logger.info("Mongoose default connection disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    Logger.info(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});
