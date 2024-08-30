import { Model } from "sequelize";
import User from "../models/user.model";
import { IUser } from "../utils/IUser";

export class UserService {
  static async create(createDto: any): Promise<any> {
    const user = await User.create(createDto);
    return user.save();
  }

  static async getMany(findDto: any): Promise<IUser | null> {
    const users = await User.findOne(findDto);
    return users.dataValues;
  }
}
