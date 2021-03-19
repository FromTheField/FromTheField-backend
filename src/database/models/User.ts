import { Document, Schema, model } from "mongoose";

export const DOCUMENT_NAME = "user";
export const COLLECTION_NAME = "users";

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
  
  export default interface User extends Document {
    _id:string;
    email: string;
    name?: string;
    background?: background[];
    password: string;
    rating?: number[];
    desc?: string;
    phNum?: string;
    location?: string;
    isMentor?:boolean;
    org?:string;
    createdAt?: Date;
    updatedAt?: Date;
    token?:string;
    googleId?: string;
  }

  const userSchema = new Schema({
    email: {
      type: Schema.Types.String,
      // required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: Schema.Types.String,
      // required: true,
      trim: true,
      maxlength: 100,
    },
    org:{
      type: Schema.Types.String,
      trim: true,
      maxlength: 100,
    },
    password: {
      type: Schema.Types.String,
      // required: true,
      trim: true,
    },
    background: {
      type: [backgroundSchema]
    },
    rating: {
      type: [Schema.Types.Number],
      default: [0, 0, 0, 0, 0],
      select:"false"
    },
    desc: {
      type: Schema.Types.String,
      maxlength: 300,
      trim: true,
    },
    phNum: {
      type: Schema.Types.String,
      maxlength: 50,
      trim: true,
    },
    location: {
      type: Schema.Types.String,
      maxlength: 70,
      trim: true,
    },
    isMentor:{
      type:Schema.Types.Boolean,
      default:false,
      // requried:true
    },
    createdAt: {
      type: Schema.Types.Date,
      // required: true,
    },
    updatedAt: {
      type: Schema.Types.Date,
      // required: true,
    },
    token: { type: String },
    googleId: { type: String },
  });
  
  export const UserModel = model<User>(
    DOCUMENT_NAME,
    userSchema,
    COLLECTION_NAME
  );
  
  