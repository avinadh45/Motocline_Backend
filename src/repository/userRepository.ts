import { Model } from "mongoose";
import { IUser } from "../interface/User/userinterface";
import { IUserCreateRepository } from "../interface/User/IUserCreateRepository";
import { IUserReadRepository } from "../interface/User/IUserReadRepository";
import { IUserUpdateRepository } from "../interface/User/IUserUpdateRepository";
import { BaseRepository } from "./base/BaseRepository";

export class UserRepository
    extends BaseRepository<IUser>
    implements IUserCreateRepository, IUserReadRepository, IUserUpdateRepository {

    constructor(userModel: Model<IUser>) {
        super(userModel);
    }

    async createUser(userData: IUser): Promise<IUser> {
        return await this.create(userData);
    }

    async findUserByEmail(Email: string): Promise<IUser | null> {
        return await this.findOne({ email: Email });
    }

    async findUserById(id: string): Promise<IUser | null> {
        return await this.findById(id);
    }

    async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        return await this.updateById(id, updateData);
    }
}
