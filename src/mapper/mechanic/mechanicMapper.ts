import { MechanicResponseDTO } from "../../dto/mechanic/mechanicResponsedto";

export const mapMechanicToDTO = (mechanic: any): MechanicResponseDTO => {
  return {
    id: mechanic._id.toString(),
    email: mechanic.email,
    garageId: mechanic.garageId,
    isBlocked: mechanic.isBlocked
  }
}