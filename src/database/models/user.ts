import { Schema, model, Document } from "mongoose";
import Role from "./role";

export const DOCUMENT_NAME = "user";
export const COLLECTION_NAME = "users";

export default interface User extends Document {
  name?: String;
  email: String;
  password: String;
  roles?: Role[];
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  roles: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  createdAt: {
    type: Schema.Types.Date,
  },
  updatedAt: {
    type: Schema.Types.Date,
  },
});

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
