import { IMechanic } from "./machanicinterface"

export interface IMechanicReadRepository {
  findByEmail(email: string): Promise<IMechanic | null>
  findById(id: string): Promise<IMechanic | null>
  findByGarage(garageId: string): Promise<IMechanic[]>
  
}