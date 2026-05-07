import { Model } from "mongoose";
import { IUser } from "../interface/User/userinterface";
import { IUserCreateRepository } from "../interface/User/IUserCreateRepository";
import { IUserReadRepository } from "../interface/User/IUserReadRepository";
import { IUserUpdateRepository } from "../interface/User/IUserUpdateRepository";
import { BaseRepository } from "./base/BaseRepository";
import User from "../model/Usermodel";

export class UserRepository
    extends BaseRepository<IUser>
    implements IUserCreateRepository, IUserReadRepository, IUserUpdateRepository {

    constructor(userModel: Model<IUser>) {
        super(userModel);
    }

    async createUser(userData: IUser): Promise<IUser> {
        return await this.create(userData);
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
    return await (this.model as any)
        .findOne({ email })
        .select("+password");
    }

    async findUserById(id: string): Promise<IUser | null> {
        return await this.findById(id);
    }

    async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        return await this.updateById(id, updateData);
    }

    async findUserByResetToken(token: string): Promise<IUser | null> {
       return await this.findOne({ resetToken: token });
    }
    async getAllUser(): Promise<IUser[]> {
        return await User.find({role:"user"}).sort({createAt:-1})
    }
  async updateById(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
      return await User.findByIdAndUpdate(id,updateData,{returnDocument:"after"})
  }
}
