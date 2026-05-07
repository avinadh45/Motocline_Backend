
  import { CreateMechanicDTO } from "../../dto/mechanic/createMechanicdto"
  import { MechanicLoginDTO } from "../../dto/mechanic/mechanicLoginDTO"
  import { MechanicResponseDTO } from "../../dto/mechanic/mechanicResponsedto"
  import { MechanicAuthResponseDTO } from "../../dto/mechanic/mechanicAuthDTO"
// import { IMechanic } from "./machanicinterface"
  export interface IMechanicService {

    createMechanic(data: CreateMechanicDTO): Promise<MechanicResponseDTO>
    login(data:MechanicLoginDTO): Promise<MechanicAuthResponseDTO>
    getMechanics(garageId: string): Promise<MechanicResponseDTO[]>
    block(id:string):Promise<MechanicResponseDTO>
  }