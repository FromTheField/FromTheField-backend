import { Schema, model, Document } from "mongoose";
import Role from "./role";

export const DOCUMENT_NAME = "mentee";
export const COLLECTION_NAME = "mentees";

export default interface Mentee extends Document {
  name?: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema({
  name: {
    type: Schema.Types.String,
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
    select: false,
    required: true,
  },
  updatedAt: {
    type: Schema.Types.Date,
    select: false,
    required: true,
  },
});

export const MenteeModel = model<Mentee>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
