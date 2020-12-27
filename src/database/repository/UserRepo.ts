import User, { UserModel } from "../models/User";
import Keystore from "../models/keystore";
import KeystoreRepo from "./KeyStoreRepo";


const allInfo = "+name +email +password + ratings";
export default class UserRepo {
    public static findByEmail(email: string): Promise<User> {
        return UserModel.findOne({ email })
          .select(allInfo)
          .lean<User>()
          .exec();
      }
    
  public static findById(id: string): Promise<User> {
    return UserModel.findById(id)
      .lean<User>()
      .exec();
  }
  public static fetchAll():Promise<User[]> {
    return UserModel.find({})
    .select(allInfo)
    .lean<User>()
    .exec();
  }

  public static async editRating(
    email: string,
    userRating: number[]
  ): Promise<any> {
    return UserModel.updateOne({ email }, { $set: { rating: userRating } });
  }

  public static async create(
    user: User,
    access_token: string,
    refresh_token: string
  ): Promise<{ user: User; keystore: Keystore }> {
    const now = new Date();

    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    const keystore = await KeystoreRepo.create(
      createdUser,
      access_token,
      refresh_token,
    );
    return { user: createdUser.toObject(), keystore };
  }
}
