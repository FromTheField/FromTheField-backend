import { Schema, Document, model } from "mongoose";
import User from "./user";

export const DOCUMENT_NAME = "Keystore";
export const COLLECTION_NAME = "keystores";

export default interface Keystore extends Document {
  client: User;
  primaryKey: string;
  secondarKey: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  primaryKey: {
    type: Schema.Types.String,
    required: true,
  },
  secondaryKey: {
    type: Schema.Types.String,
    required: true,
  },
  status: {
    type: Schema.Types.Boolean,
    default: true,
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

export const KeyStoreModel = model<Keystore>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
