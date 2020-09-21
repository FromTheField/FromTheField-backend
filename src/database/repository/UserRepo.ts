import User, { UserModel } from "../models/user";
import Role, { RoleModel, RoleCode } from "../models/role";
import RoleRepo from "./RoleRepos";

export default class UserRepo {
  public static findByEmail(email: string): Promise<User> {
    return UserModel.findOne({ email }).lean<User>().exec();
  }
  public static async create(
    user: User,
    roleCode: RoleCode
  ): Promise<{ user: User }> {
    const now = new Date();

    const role = await RoleRepo.findByCode(roleCode);
    //TODO:ERROR HANDLING FOR INTERNAL ERRORE HERE

    user.roles = [role._id];
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    return { user: createdUser.toObject() };
  }
}
