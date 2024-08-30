import { Model } from "sequelize";
import User from "../models/user.model";

export class UserService {
  static async create(createDto: any): Promise<any> {
    const user = await User.create(createDto);
    return user.save();
  }

  static async getMany(findDto: any): Promise<Model<any, any>> {
    const users = await User.findOne(findDto)
    return users;
  }
}
