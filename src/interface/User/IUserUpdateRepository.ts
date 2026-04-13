import { IUser } from "./userinterface";

export interface IUserUpdateRepository {
    updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
}
