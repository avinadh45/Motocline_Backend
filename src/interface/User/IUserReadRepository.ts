import { IUser } from "./userinterface";

export interface IUserReadRepository{
    findUserByEmail(Email:string):Promise <IUser | null>;
    findUserById(id:string) : Promise<IUser | null>
}