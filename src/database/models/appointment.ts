import { CANCELLED } from "dns";
import { Document, Schema, model, Types } from "mongoose";
import User from "./User";

export const DOCUMENT_NAME = "appointment";
export const COLLECTION_NAME = "appointments";


enum Status {
    PENDING="pending",
    CONFIRMED="confirmed",
    CANCELLED="cancelled",
}

export default interface Appointment extends Document{
    mentee:User;
    mentor:User;
    time:Date;
    info:string; 
    status?:Status;
    createdAt?:Date;
    updatedAt?:Date;
}

const appointmentSchema = new Schema({
        mentee:{
            type: Schema.Types.ObjectId,
            ref: "user",
            required:true,
        },
        mentor:{
            type: Schema.Types.ObjectId,
            ref: "user",
            required:true,
        },
        time:{
            type:Schema.Types.Date,
            required:true,
        },
        info:{
            type:Schema.Types.String,
            trim:'true',
        },
        status:{
            type:Schema.Types.String,
            enum:[Status.CANCELLED,Status.CONFIRMED,Status.PENDING],
            required:true,
            default:Status.PENDING,
        }
  });


  export const AppointmentModel = model<Appointment>(
    DOCUMENT_NAME,
    appointmentSchema,
    COLLECTION_NAME
  );
  
  