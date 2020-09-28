import { Schema, model, Document } from "mongoose";
import Role from "./role";

export const DOCUMENT_NAME = "user";
export const COLLECTION_NAME = "users";

export default interface User extends Document {
  name?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    maxlength: 100,
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
    trim: true,
    select: false,
  },
  createdAt: {
    type: Schema.Types.Date,
  },
  updatedAt: {
    type: Schema.Types.Date,
  },
});

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
