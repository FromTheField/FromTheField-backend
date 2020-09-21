import Role, { RoleModel, RoleCode } from "../models/role";

export default class RoleRepo {
  public static findByCode(code: RoleCode): Promise<Role> {
    return RoleModel.findOne({ code, status: true })
      .select("+email +password")
      .lean<Role>()
      .exec();
  }
}
