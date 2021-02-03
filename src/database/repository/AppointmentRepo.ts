
import { Types } from 'mongoose';
import { GOOGLE_CALENDER } from '../../config';
import { NoData } from '../../core/ApiError';
import Appointment, { AppointmentModel,Status } from '../models/appointment'
import User from '../models/User';
import {google} from 'googleapis';
import crypto from 'crypto'
import app from '../../app';

type numorstring = number|string;

const CREDENTIALS = JSON.parse(GOOGLE_CALENDER.credentials);
const calendarId = GOOGLE_CALENDER.calender_id;

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

const TIMEOFFSET = '+05:30';

class GoogleMeet {

    private static dateTimeForCalander(dateInput:Date) {

        let date:Date = dateInput;
    
        let year:numorstring = date.getFullYear();
        let month:numorstring = date.getMonth() + 1;
    
    
        if (month < 10) {
            month = `0${month}`;
        }
        let day:numorstring = date.getDate();
    
        if (day < 10) {
            day = `0${day}`;
        }
        let hour:numorstring = date.getHours();
        if (hour < 10) {
            hour = `0${hour}`;
        }
        let minute:numorstring = date.getMinutes();
        if (minute < 10) {
            minute = `0${minute}`;
        }
    
        let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;
    
        let event = new Date(Date.parse(newDateTime));
    
        let startDate = event;
        // Delay in end time is 1
        let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));
    
        return {
            'start': startDate,
            'end': endDate
        }
    };

    // Insert new event to Google Calendar
        private static async insertEvent(event:any,app:Appointment) {
            try {
                let response = await calendar.events.insert({
                     auth ,
                     calendarId,
                    resource: event,
                } as any);
              //  console.log("google response ", JSON.stringify(response,null,2));
                if (response['status'] == 200 && response['statusText'] === 'OK') {
                    console.log(JSON.stringify(response.data,null,2));
                    return 1;
                } else {
                    return 0;
                }
            } catch (error) {
                console.log(`Error at insertEvent --> ${error}`);
                return 0;
            }
        };

        public static async insertEventIntoCal(app:Appointment) { 
            // console.log("second func",JSON.stringify(app,null,3));
            let dateTime = this.dateTimeForCalander(app.time);
            const id = await crypto.randomBytes(20).toString('hex')
            // Event for Google Calendar
            let event = {
                'summary': `Meeting with ${app.mentor.name}`,
                'description': `about:\n${app.info}\n\nScheduled from the fromthefield app`,
                "conferenceDataVersion": 1,
                'start': {
                    'dateTime': dateTime['start'],
                    'timeZone': 'Asia/Kolkata'
                 },
                'end': {
                    'dateTime': dateTime['end'],
                    'timeZone': 'Asia/Kolkata'
                },
                "conferenceData": {
                    "createRequest": {
                      "conferenceSolutionKey": {
                        "type": "hangoutsMeet"
                      },
                      "requestId": id,
                    }
                },
                'reminders': {
                    'useDefault': false,
                    'overrides': [
                      {'method': 'email', 'minutes': 24 * 60},
                      {'method': 'popup', 'minutes': 10},
                    ],
                  },
           };
            try {
                const result = await this.insertEvent(event,app);
                console.log("insertevent into cal success",event);
            }catch(err) {
                console.log("insertevent into cal failed ",err);
            }
        }


        //Get all the events between two dates
        private static async getEvents(dateTimeStart:any, dateTimeEnd:any){

            try {
                let response = await calendar.events.list({
                    auth: auth,
                    calendarId: calendarId,
                    timeMin: dateTimeStart,
                    timeMax: dateTimeEnd,
                    timeZone: 'Asia/Kolkata'
                });
            
                let items = response['data']['items'];
                return items;
            } catch (error) {
                console.log(`Error at getEvents --> ${error}`);
                return 0;
            }
        };
    
}







export default class AppointmentRepo {
    public static async create(appointment:Appointment):Promise<Appointment> {
        const now = new Date();
        appointment.createdAt = appointment.updatedAt = now;
        const createdApp = await AppointmentModel.create(appointment);
        return createdApp.toObject();
    }
    public static async findById(id:Types.ObjectId):Promise<Appointment> {
        return AppointmentModel.findById(id).populate("mentor").populate("mentee").lean<Appointment>().exec();
    }
    public static async findByMentorMenteeTime(mentee:User,mentor:User,time:Date):Promise<Appointment> {
        return AppointmentModel.findOne({mentee,mentor,time}).lean<Appointment>().exec();
    }
    public static async fetchAll():Promise<Appointment[]>{
        return AppointmentModel.find({}).lean<Appointment>().exec();
    }
    public static fetchByMentor(mentor:User):Promise<Appointment[]> {
        if(!mentor.isMentor)
            throw new NoData(`${mentor.name} / ${mentor.email} is not a mentor`);
        return AppointmentModel.find({mentor}).lean<Appointment>().exec();
    }
    public static fetchByMentorAndStatus(mentor:User,status:Status):Promise<Appointment[]> {
        if(!mentor.isMentor)
            throw new NoData(`${mentor.name} / ${mentor.email} is not a mentor`);
        return AppointmentModel.find({mentor,status}).lean<Appointment>().exec();
    }
    public static fetchByMentee(mentee:User):Promise<Appointment[]> {
        if(mentee.isMentor)
             throw new NoData(`${mentee.name} / ${mentee.email} is not a mentee but a mentor`);
        return AppointmentModel.find({mentee}).lean<Appointment>().exec();
    }
    public static fetchByMenteeAndStatus(mentee:User,status:Status):Promise<Appointment[]> {
        if(mentee.isMentor)
                 throw new NoData(`${mentee.name} / ${mentee.email} is not a mentee but a mentor`);
        return AppointmentModel.find({mentee,status}).lean<Appointment>().exec();
    }
    public static async cancel(appointment:Appointment):Promise<any> {
        return AppointmentModel.findOneAndDelete({_id:appointment._id}).lean<Appointment>().exec();
    }
    public static async editStatus(appointment:Appointment,status:Status):Promise<Appointment> {
        if(status === Status.CONFIRMED) {
            let link = await this.generateGoogleMeetLink(appointment);
        }
        return AppointmentModel.findOneAndUpdate({_id:appointment._id},{status},{new:true});
    }
    private static async generateGoogleMeetLink(app:Appointment):Promise<any> {
        console.log("first func")
          return await  GoogleMeet.insertEventIntoCal(app);
    }
}