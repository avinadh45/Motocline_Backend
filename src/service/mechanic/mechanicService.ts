import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { IMechanicService } from "../../interface/Machanic/IMechanicservice";
import { IMechanicWriteRepository } from "../../interface/Machanic/IMechanicWriteRepository";
import { IMechanicReadRepository } from "../../interface/Machanic/IMechanicReadRepository";
import { CreateMechanicDTO } from "../../dto/mechanic/createMechanicdto";
import { MachanicMapper } from "../../mapper/mechanic/mechanicMapper";
import { MechanicLoginDTO } from "../../dto/mechanic/mechanicLoginDTO";
import { MechanicAuthResponseDTO } from "../../dto/mechanic/mechanicAuthDTO";
import { MechanicResponseDTO } from "../../dto/mechanic/mechanicResponsedto";
export class MechanicService implements IMechanicService {
  constructor(
    private readRepository: IMechanicReadRepository,
    private writeRepository: IMechanicWriteRepository,
  ) {}

  async createMechanic(data: CreateMechanicDTO) {
    const existing = await this.readRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("Mechanic already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const entity = MachanicMapper.toEntity({
      ...data,
      password: hashedPassword,
    });
    const newMechanic = await this.writeRepository.create(entity);
    return MachanicMapper.toResponse(newMechanic);
  }

  async login(data: MechanicLoginDTO): Promise<MechanicAuthResponseDTO> {
    const mechanic = await this.readRepository.findByEmail(data.email);

    if (!mechanic) {
      throw new Error("Mechanic not found");
    }

    if (mechanic.isBlocked) {
      throw new Error(
        "Account is blocked. Please contact your service center.",
      );
    }

    const isMatch = await bcrypt.compare(
      data.password,
      mechanic.password as string,
    );

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken({
      id: mechanic._id.toString(),
      role: "mechanic",
    });

    const refreshToken = generateRefreshToken({
      id: mechanic._id.toString(),
      role: "mechanic",
    });
    return {
      mechanic: MachanicMapper.toResponse(mechanic),
      accessToken,
      refreshToken,
    };
  }

  async getMechanics(garageId: string) {
    const mechanic = await this.readRepository.findByGarage(garageId);
    return mechanic.map(MachanicMapper.toResponse);
  }

  async block(id: string): Promise<MechanicResponseDTO> {
     const mechanic = await this.readRepository.findById(id)
    if(!mechanic){
      throw new Error("mechanic not found")
    }
    const data = await this.writeRepository.update(id,{isBlocked:!mechanic.isBlocked})
    if(!data){
      throw new Error(" failed  ")
    }
    return MachanicMapper.toResponse(data)
  }
  // async getMechanics(serviceCenterId:string){
  //     const mechanic = await this.readRepository.findByGarage(serviceCenterId)
  //     return mechanic.map(MapMechanicToDTO)
  // }
  
}
