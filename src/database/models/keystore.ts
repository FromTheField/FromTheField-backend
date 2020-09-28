import { Schema, Document, model } from "mongoose";
import Mentee from "./mentee";
import Mentor from "./mentor";

export const DOCUMENT_NAME = "Keystore";
export const COLLECTION_NAME = "keystores";

export default interface Keystore extends Document {
  _mentee?: Mentee;
  _mentor?: Mentor;
  primaryKey: string;
  secondarKey: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema({
  _mentee: {
    type: Schema.Types.ObjectId,
    ref: "mentee",
  },
  _mentor: {
    type: Schema.Types.ObjectId,
    ref: "mentor",
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
