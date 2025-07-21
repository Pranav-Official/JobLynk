import db from "../models";
import type { UserAttributes } from "../models/user/user.model";

class UserService {
  async createUser(userAttributes: UserAttributes): Promise<UserAttributes> {
    const user = await db.User.create(userAttributes);
    return user.get({ plain: true });
  }

  async updateAnyUserAttribute(
    userId: string,
    updates: Partial<UserAttributes>,
  ): Promise<UserAttributes> {
    console.log("userid", userId);
    const user = await db.User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await user.update(updates);
    return user.get({ plain: true });
  }
}

export default new UserService();
