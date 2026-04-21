import mongoose from "mongoose"
import UserModel from "../../model/Usermodel"
import { IMechanic } from "../../interface/Machanic/machanicinterface"
import { IMechanicReadRepository } from "../../interface/Machanic/IMechanicReadRepository"

export class MechanicReadRepository implements IMechanicReadRepository {

  async findByEmail(email: string): Promise<IMechanic | null> {
    return await UserModel.findOne({ email, role: "mechanic" }).lean() as IMechanic | null
  }

  async findById(id: string): Promise<IMechanic | null> {
    return await UserModel.findById(id).lean() as IMechanic | null
  }

  async findByGarage(garageId: string): Promise<IMechanic[]> {
    return await UserModel.find({
      role: "mechanic",
      garageId: new mongoose.Types.ObjectId(garageId)
    } as any).lean() as IMechanic[]
  }

}