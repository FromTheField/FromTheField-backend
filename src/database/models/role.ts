import { Schema, Document, model } from "mongoose";

export const DOCUMENT_NAME = "Role";
export const COLLECTION_NAME = "Roles";

export const enum RoleCode {
  ADMIN = "admin",
  MENTOR = "mentor",
  MENTEE = "mentee",
}

export default interface Role extends Document {
  code: RoleCode;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema({
  code: {
    type: Schema.Types.String,
    required: true,
    enum: [RoleCode.ADMIN, RoleCode.MENTOR, RoleCode.MENTEE],
    trim: true,
  },
  status: {
    type: Schema.Types.Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
