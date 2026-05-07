import { IUser } from "../../interface/User/userinterface";
import { IUserCreateRepository } from "../../interface/User/IUserCreateRepository";
import { IUserReadRepository } from "../../interface/User/IUserReadRepository";
import { IUserUpdateRepository } from "../../interface/User/IUserUpdateRepository";

import { IUserService } from "../../interface/User/IUserService";
import { IOtpRepository } from "../../repository/otp/IOtpRepository";
import { IMailService } from "../mail/IMailService";
import { UserRegisterDTO } from "../../dto/user/RegisterDTO";
import { userResponseDTO } from "../../dto/user/ResponseDTO";
import { UserMapper } from "../../mapper/user/UserMapper";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { VerifyOtpDTO } from "../../dto/user/OtpDto";
import { LoginDTO } from "../../dto/user/LoginDTO";
import { ForgotPasswordDTO } from "../../dto/user/ForgotpasswordDTO";
import { ResetPasswordDTO } from "../../dto/user/RestpasswordDTO";
import { GoogleLoginDTO } from "../../dto/user/googleDTO";
import { userListDTO } from "../../dto/admin/userListDTO";
import { userDetailsDTO } from "../../dto/admin/userDetail";

export class UserService implements IUserService {
  constructor(
    private userReadrepo: IUserReadRepository,
    private userCreaterepo: IUserCreateRepository,
    private userUpdaterepo: IUserUpdateRepository,
    private otpRepo: IOtpRepository,
    private mailService: IMailService,
  ) {}

  async registerUser(userData: UserRegisterDTO): Promise<userResponseDTO> {




    const existingUser = await this.userReadrepo.findUserByEmail(
      userData.email,
    );
    if (existingUser && existingUser.isVerified) {
      throw new Error("User already exists");
    }

    if (existingUser && !existingUser.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await this.otpRepo.saveOtp(userData.email, otp, 300);
      await this.mailService.sendOtpMail(userData.email, otp);

      console.log("Resent OTP:", otp);

      // return existingUser;
      throw new Error("OTP resent. Please verify your account.");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      ...userData,
      password: hashedPassword,
      isVerified: false,
    };
    const user = await this.userCreaterepo.createUser(newUser);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.otpRepo.saveOtp(userData.email, otp, 300);
    await this.mailService.sendOtpMail(userData.email, otp);
    console.log("otp", otp);
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });

    return UserMapper.toAuthResponse(user, accessToken, refreshToken);
  }

  async verifyOtp(dto:VerifyOtpDTO): Promise<boolean> {
    const storedOtp = await this.otpRepo.getOtp(dto.email);

    console.log("Stored OTP from Redis:", storedOtp);
   
    if (!storedOtp) {
      throw new Error("OTP Expired");
    }

    const enteredOtpStr = String(dto.otp).trim();
    const storedOtpStr = String(storedOtp).trim();

    console.log(" OTppppppppppps:");

    if (storedOtpStr !== enteredOtpStr) {
      throw new Error("Invalid OTP");
    }

    const user = await this.userReadrepo.findUserByEmail(dto.email);

    if (user) {
      await this.userUpdaterepo.updateUser(user._id.toString(), {
        isVerified: true,
      });
    }

    await this.otpRepo.deleteOtp(dto.email);

    return true;
  }
  async loginUser(dto:LoginDTO): Promise<userResponseDTO> {

    const user = await this.userReadrepo.findUserByEmail(dto.email);

    if (!user) {
      throw new Error("user not found");
    }
    if (user.isBlocked) {
      throw new Error("Your Account is Blocked");
    }
    console.log("Login request:", dto.email, dto.password);
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const accessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });
    return UserMapper.toAuthResponse(user,accessToken,refreshToken)
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    );
    const newAccessToken = generateAccessToken(decoded.id);
    return { accessToken: newAccessToken };
  }
  async resendOtp(email: string): Promise<void> {
    const user = await this.userReadrepo.findUserByEmail(email);
    if (!user) {
      throw new Error("user not found");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.otpRepo.saveOtp(email, otp, 300);
    await this.mailService.sendOtpMail(email, otp);

    console.log("Resent OTP:", otp);
  }

  async forgotPassword(dto: ForgotPasswordDTO) {
    const user = await this.userReadrepo.findUserByEmail(dto.email);

    if (!user) {
      throw new Error("user not found");
    }
    const token = crypto.randomBytes(30).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 10);
    await this.userUpdaterepo.updateUser(user._id.toString(), {
      resetToken: token,
      resetTokenExpiry: expiry,
    });
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    await this.mailService.sendResetPasseord(dto.email, resetLink);
  }

  async resetPassword(dto:ResetPasswordDTO): Promise<void> {
    const user = await this.userReadrepo.findUserByResetToken(dto.token);

    if (!user) {
      throw new Error("invald");
    }
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new Error("reset token expired");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.userUpdaterepo.updateUser(user._id.toString(), {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    console.log("New password", dto.password);
    console.log("User before update:", user.password);
  }
  async googleLogin(data:GoogleLoginDTO):Promise<userResponseDTO> {
    let user = await this.userReadrepo.findUserByEmail(data.email);

    if (!user) {
      user = await this.userCreaterepo.createUser({
        name: data.name,
        email: data.email,
        googleId: data.googleId,
      });
    }

    const accessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });

    return UserMapper.toAuthResponse(user,accessToken,refreshToken)
  }
  async userList(): Promise<userListDTO[]> {
    const user = await this.userReadrepo.getAllUser()
    return user.map(UserMapper.toUserList)
}

async getUser(id:string):Promise<userDetailsDTO>{
  const user = await this.userReadrepo.findUserById(id)
  if(!user){
    throw new Error("user not found")
  }
  return UserMapper.toUserDetailsDTP(user)
}
async block(id: string): Promise<userDetailsDTO> {

  const existingUser = await this.userReadrepo.findUserById(id)
   console.log("Before:", existingUser?.isBlocked)
  if(!existingUser){
    throw new Error("no user found")
  }
  const user = await this.userUpdaterepo.updateUser(id,{isBlocked:!existingUser.isBlocked})
 console.log("After:", user?.isBlocked)
  if(!user){
    throw new Error("failed to update")
  }
  
  return UserMapper.toUserDetailsDTP(user)
}
}