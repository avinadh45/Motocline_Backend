import { IMechanic } from "./machanicinterface";
import { CreateMechanicDTO } from "../../dto/mechanic/createMechanicdto";

export interface IMechanicWriteRepository{
    create (data:CreateMechanicDTO):Promise<IMechanic>
    save(user:IMechanic):Promise<IMechanic>
}