import db from "../models";
import type { UserAttributes } from "../models/user/user.model";

class UserService {
  async createUser(userAttributes: UserAttributes): Promise<UserAttributes> {
    const user = await db.User.create(userAttributes);
    return user.get({ plain: true });
  }

  async updateUserRole(userId: number, role: string): Promise<UserAttributes> {
    const user = await db.User.findByPk(userId);
    if (!user) throw new Error("User not found");
    await user.update({ role });
    return user.get({ plain: true });
  }
}

export default new UserService();
