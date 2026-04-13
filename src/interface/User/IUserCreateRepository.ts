
import { IUser } from "./userinterface";


export interface IUserCreateRepository{
    createUser(userData:IUser): Promise<IUser>
}
