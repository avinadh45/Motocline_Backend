import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { IMailService } from "../mail/IMailService";
import { ServiceCenterRepository } from "../../repository/ServiceCenter/serviceCenterRepository";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { IServiceCenterService } from "../../interface/ServiceCenter/IServiceCenterService";
import { ServiceCenterRegisterDTO } from "../../dto/serviceCenter/RegisterDTO";
import { ServiceCenterMapper } from "../../mapper/ServiceCenter/ServiceCenterMapper";
import { ServiceCenterLogin } from "../../dto/serviceCenter/LoginDTO";
import { IServiceCenterRepository } from "../../interface/ServiceCenter/IServiceCenterRepository";
import type { servicecenterDTO } from "../../dto/admin/ServiceCenterListDTO";
import { serviceCenterDetailsDTO } from "../../dto/admin/serviceCenterDetails";
import { ForgotPasswordDTO } from "../../dto/serviceCenter/forgotDTO";
import { ResetPasswordDTO } from "../../dto/serviceCenter/resetPassword";
export class ServiceCenterService implements IServiceCenterService {
  constructor(private repository: IServiceCenterRepository, private mailService: IMailService) {}

  async register(dto: ServiceCenterRegisterDTO) {
    const existing = await this.repository.findByEmail(dto.email);

    if (existing) {
      throw new Error("Service center already exists");
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    dto.password = hashedPassword;

    const data = ServiceCenterMapper.toEntity({
      ...dto,
    });

    const saved = await this.repository.createServiceCenter(data);

    return saved;
  }

  async login(dto: ServiceCenterLogin) {
    const serviceCenter = await this.repository.findByEmail(dto.email);

    if (!serviceCenter) {
      throw new Error("Service center not found");
    }
    if(serviceCenter.isBlocked === true){
      throw new Error("Service Center is blocked")
    }
    const isMatch = await bcrypt.compare(dto.password, serviceCenter.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken({
      id: serviceCenter._id.toString(),
      role: "serviceCenter",
    });

    const refreshToken = generateRefreshToken({
      id: serviceCenter._id.toString(),
      role: "serviceCenter",
    });

    return ServiceCenterMapper.authResponse(
      serviceCenter,
      accessToken,
      refreshToken,
    );
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    );
    const newAccessToken = generateAccessToken(decoded.id);
    return { accessToken: newAccessToken };
  }

  async forgotpassword(dto:ForgotPasswordDTO){
    const serviceCenter = await this.repository.findByEmail(dto.email)
    if(!serviceCenter){
      throw new Error("email not here")
    }
    const token =  crypto.randomBytes(30).toString("hex");
    const expiry = new Date(Date.now()+1000*60*10)
    await this.repository.updateServiceCenter(
      serviceCenter._id.toString(),
      {resetToken:token,resetTokenExpiry:expiry}
    )
    const resetLink = `http://localhost:5173/service-center/reset-password?token=${token}`;
    await this.mailService.sendResetPasseord(dto.email, resetLink);
  }

  async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    const serviceCenter = await this.repository.findServiceCenterByToken(dto.token)
    if(!serviceCenter){
      throw new Error("invalid")
    }
    if(!serviceCenter.resetTokenExpiry || serviceCenter.resetTokenExpiry < new Date()){
      throw new Error("rEST TOKEN EXpired")
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
      console.log("NEW HASH:", hashedPassword); 
    await this.repository.updateServiceCenter(serviceCenter._id.toString(),{password:hashedPassword,resetToken:null,resetTokenExpiry:null})
    const updated = await this.repository.findByEmail(serviceCenter.email)
      console.log("DB PASSWORD:", updated?.password); 

  }

  async serviceCenterList(): Promise<servicecenterDTO[]> {
    const serviceCenter = await this.repository.findAll();
    return serviceCenter.map(ServiceCenterMapper.toListDTO);
  }

  async getServiceCenter(id:string): Promise<serviceCenterDetailsDTO> {
    const serviceCenter = await this.repository.findById(id)
    if(!serviceCenter){
      throw new Error("service center not found")
    }
    return ServiceCenterMapper.toDetailsDTO(serviceCenter)
  }

  async block(id: string): Promise<serviceCenterDetailsDTO> {
    const data = await this.repository.findById(id)
    if(!data){
      throw new Error("service center not found")
    }
    const serviceCenter = await this.repository.updateServiceCenter(id,{isBlocked:!data.isBlocked})
    if(!serviceCenter){
      throw new Error("failed to update")
    }
    return ServiceCenterMapper.toDetailsDTO(serviceCenter)
  }
}

