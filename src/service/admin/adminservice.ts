import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { IUserReadRepository } from "../../interface/User/IUserReadRepository"
import { AdminLoginDTO } from "../../dto/admin/adminLogindto"
import { AdminAuthResponseDTO } from "../../dto/admin/adminAuthResponsedto"
import { IUserUpdateRepository } from "../../interface/User/IUserUpdateRepository"
import { generateAccessToken, generateRefreshToken } from "../../utils/token"
import { mapAdminToDTO } from "../../mapper/admin/adminMapper"

export class Adminservice{

    constructor(private userReadRepo:IUserReadRepository , private userupdateRepo:IUserUpdateRepository){}
    async login(data : AdminLoginDTO) : Promise<AdminAuthResponseDTO>{

        const user = await this.userReadRepo.findUserByEmail(data.email)

        if(!user || user.role !== "admin"){
            throw new Error("Admin not found")
        }
        const isMatch = await bcrypt.compare(data.password,user.password)

        if(!isMatch){
            throw new Error("Invalid Error")
        }
        const accessToken = generateAccessToken(user._id.toString())
        const refreshToken = generateRefreshToken(user._id.toString())
        return{
            admin: mapAdminToDTO(user),
            accessToken,
            refreshToken
        }
    }
    async refreshToken(token: string) {

  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as { id: string }

  const user = await this.userReadRepo.findUserById(decoded.id)

  if (!user || user.role !== "admin") {
    throw new Error("Invalid admin")
  }

  const accessToken = generateAccessToken(user._id.toString())

  return accessToken
}
async toggleUserBlock(userId: string) {

  const user = await this.userReadRepo.findUserById(userId)

  if (!user) {
    throw new Error("User not found")
  }

  const updatedUser = await this.userupdateRepo.updateUser(userId, {
    isBlocked: !user.isBlocked
  })

  return updatedUser
}
}