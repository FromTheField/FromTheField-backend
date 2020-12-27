import Mentor, { MentorModel } from "../models/mentor";
import background from "../models/mentor";

export default class MentorRepo {
  public static findByEmail(email: string): Promise<Mentor> {
    return MentorModel.findOne({ email })
      .select("+name +email +password")
      .lean<Mentor>()
      .exec();
  }
  public static fetchAll(): Promise<Mentor[]> {
    return MentorModel.find({})
      .select("+name +email +ratings")
      .lean<Mentor>()
      .exec();
  }

  public static async editRating(
    email: string,
    userRating: number[]
  ): Promise<any> {
    return MentorModel.updateOne({ email }, { $set: { rating: userRating } });
  }
  public static async create(
    email: string,
    name: string,
    background: background[],
    password: string,
    desc: string,
    phNum: string,
    location: string
  ): Promise<Mentor> {
    const now = new Date();
    const mentor = await MentorModel.create(({
      email,
      name,
      background,
      password,
      desc,
      phNum,
      location,
      createdAt: now,
      updatedAt: now,
    } as unknown) as Mentor);
    return mentor.toObject();
  }
}
