import Mentee, { MenteeModel } from "../models/mentee";
import Keystore from "../models/keystore";
import KeystoreRepo from "./KeyStoreRepo";

export default class MenteeRepo {
  public static findByEmail(email: string): Promise<Mentee> {
    return MenteeModel.findOne({ email })
      .select("+email +password")
      .lean<Mentee>()
      .exec();
  }
  public static async create(
    user: Mentee,
    access_token: string,
    refresh_token: string
  ): Promise<{ user: Mentee; keystore: Keystore }> {
    const now = new Date();

    user.createdAt = user.updatedAt = now;
    const createdUser = await MenteeModel.create(user);
    const keystore = await KeystoreRepo.create(
      access_token,
      refresh_token,
      createdUser._id
    );
    return { user: createdUser.toObject(), keystore };
  }
}
