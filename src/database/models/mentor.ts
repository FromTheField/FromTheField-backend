import { Document, Schema, model } from "mongoose";
import { string, number } from "@hapi/joi";

export const DOCUMENT_NAME = "mentor";
export const COLLECTION_NAME = "mentors";

export interface background {
  title: string;
  place: string;
  start: number;
  end: number;
}

const backgroundSchema = new Schema({
  title: {
    type: Schema.Types.String,
    trim: true,
    required: true,
  },
  place: {
    type: Schema.Types.String,
    trim: true,
    required: true,
  },
  start: {
    type: Schema.Types.Number,
    required: true,
  },
  end: {
    type: Schema.Types.Number,
    required: true,
  },
});

export default interface Mentor extends Document {
  email: string;
  name?: string;
  background?: background[];
  password: string;
  rating?: number;
  desc?: string;
}

const mentorSchema = new Schema({
  email: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    select: false,
    maxlength: 100,
  },
  password: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    select: false,
  },
  background: [
    {
      type: backgroundSchema,
    },
  ],
  rating: {
    type: Schema.Types.Number,
    default: -1,
  },
  desc: {
    type: Schema.Types.String,
    required: true,
    maxlength: 300,
  },
});

export const MentorModel = model<Mentor>(
  DOCUMENT_NAME,
  mentorSchema,
  COLLECTION_NAME
);
