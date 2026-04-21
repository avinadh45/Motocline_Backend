
import { CreateMechanicDTO } from "../../dto/mechanic/createMechanicdto"

import { MechanicResponseDTO } from "../../dto/mechanic/mechanicResponsedto"

export interface IMechanicService {

  createMechanic(data: CreateMechanicDTO): Promise<MechanicResponseDTO>

  getMechanics(garageId: string): Promise<MechanicResponseDTO[]>

  toggleBlock(mechanicId: string): Promise<MechanicResponseDTO>

}