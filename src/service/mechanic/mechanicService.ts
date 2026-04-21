import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { IMechanicWriteRepository } from "../../interface/Machanic/IMechanicWriteRepository";
import { IMechanicReadRepository } from "../../interface/Machanic/IMechanicReadRepository";
import { CreateMechanicDTO } from "../../dto/mechanic/createMechanicdto";

export class MechanicService {
    constructor(
        private readRepository: IMechanicReadRepository,
        private writeRepository: IMechanicWriteRepository
    ) {}

    async createMechanic(serviceCenterId: string,data: CreateMechanicDTO) {
        const existing = await this.readRepository.findByEmail(data.email);
        if (existing) {
            throw new Error("Mechanic already exists with this email");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        return this.writeRepository.create({...data, garageId: serviceCenterId});
    }

    async loginMechanic(email: string, password: string) {
        const mechanic = await this.readRepository.findByEmail(email);

        if (!mechanic) {
            throw new Error("Mechanic not found");
        }

        if (mechanic.isBlocked) {
            throw new Error("Account is blocked. Please contact your service center.");
        }

        const isMatch = await bcrypt.compare(password, mechanic.password as string);

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const accessToken = generateAccessToken(mechanic._id.toString());
        const refreshToken = generateRefreshToken(mechanic._id.toString());

     
        const { password: _, ...mechanicData } = mechanic;

        return {
            mechanic: mechanicData,
            accessToken,
            refreshToken
        };
    }
    async getMechanic(serviceCenterId:string){
        const mechanic = await this.readRepository.findByGarage(serviceCenterId)
        return mechanic
    }
}
