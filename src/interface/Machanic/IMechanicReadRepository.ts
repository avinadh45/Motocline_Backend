import { IMechanic } from "./machanicinterface";
import { CreateMechanicDTO } from "../../dto/mechanic/createMechanicdto";
export interface  IMechanicReadRepository{

    findByEmail(email:string): Promise<IMechanic | null>
    findById(id: string): Promise<IMechanic | null>
    findByGarage(garageId: string): Promise<IMechanic[]>
}
export interface IMechanicUpdateRepository {

  save(mechanic: IMechanic): Promise<IMechanic>

}
export interface IMechanicCreateRepository {

  create(data: CreateMechanicDTO): Promise<IMechanic>

}