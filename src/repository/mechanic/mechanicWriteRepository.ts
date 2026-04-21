

import UserModel from "../../model/Usermodel"
import { IMechanicWriteRepository } from "../../interface/Machanic/IMechanicWriteRepository"
import { CreateMechanicDTO } from "../../dto/mechanic/createMechanicdto"
import { IMechanic } from "../../interface/Machanic/machanicinterface"


export class MechanicWriteRepository implements IMechanicWriteRepository {

  async create(data: CreateMechanicDTO): Promise<IMechanic> {

    const mechanic = await UserModel.create({
      ...data,
      role: "mechanic",
      isBlocked: false
    })

    return mechanic.toObject() as IMechanic
  }

  async save(user: IMechanic): Promise<IMechanic> {

    const updated = await UserModel.findByIdAndUpdate(
      user._id,
      user,
      { new: true }
    )

    return updated?.toObject() as IMechanic
  }
}