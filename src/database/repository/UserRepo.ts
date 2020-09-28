import User, { UserModel } from "../models/user";
import Role, { RoleModel, RoleCode } from "../models/role";
import RoleRepo from "./RoleRepos";
import { InternalError } from "../../core/ApiError";
import Keystore from "../models/keystore";
import KeystoreRepo from "./KeyStoreRepo";

export default class UserRepo {
  public static findByEmail(email: string): Promise<User> {
    return UserModel.findOne({ email })
      .select("+email +password")
      .populate({
        path: "Roles",
        match: { status: true },
      })
      .lean<User>()
      .exec();
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
      createdUser._id,
      access_token,
      refresh_token
    );
    return { user: createdUser.toObject(), keystore };
  }
}
