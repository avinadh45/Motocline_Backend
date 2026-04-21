
import { IUser } from "./userinterface";


export interface IUserCreateRepository{
    createUser(userData:Partial<IUser>): Promise<IUser>
}
