
import { NoData } from '../../core/ApiError';
import Appointment, { AppointmentModel } from '../models/appointment'
import User from '../models/User';
export default class AppointmentRepo {
    public static async create(appointment:Appointment):Promise<Appointment> {
        const now = new Date();
        appointment.createdAt = appointment.updatedAt = now;
        const createdApp = await AppointmentModel.create(appointment);
        return createdApp.toObject();
    }
    public static async fetchAll():Promise<Appointment[]>{
        return AppointmentModel.find({}).lean<Appointment>().exec();
    }
    public static fetchByMentor(mentor:User):Promise<Appointment[]> {
        if(!mentor.isMentor)
            throw new NoData(`${mentor.name} / ${mentor.email} is not a mentor`);
        return AppointmentModel.find({mentor}).lean<Appointment>().exec();
    }
    public static fetchByMentee(mentee:User):Promise<Appointment[]> {
        return AppointmentModel.find({mentee}).lean<Appointment>().exec();
    }
    public static async cancel(appointment:Appointment):Promise<any> {
        return AppointmentModel.findOneAndDelete({_id:appointment._id});
    }
}