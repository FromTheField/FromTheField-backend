import User, { UserModel } from "../models/user";
import Role, { RoleModel, RoleCode } from "../models/role";
import RoleRepo from "./RoleRepos";
import { InternalError } from "../../core/ApiError";

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
    if (!role) throw new InternalError("Invalid Role/Role Must be defined");

    user.roles = [role._id];
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    return { user: createdUser.toObject() };
  }
}
