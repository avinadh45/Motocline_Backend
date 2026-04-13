import { IUser } from "../../interface/User/userinterface";
import { IUserCreateRepository } from "../../interface/User/IUserCreateRepository";
import { IUserReadRepository } from "../../interface/User/IUserReadRepository";
import { IUserUpdateRepository } from "../../interface/User/IUserUpdateRepository";
import { IUserService } from "../../interface/User/IUserService";
import { IOtpRepository } from "../../repository/otp/IOtpRepository";
import { IMailService } from "../mail/IMailService";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";

export class UserService implements IUserService {
    constructor(
        private userReadrepo: IUserReadRepository,
        private userCreaterepo: IUserCreateRepository,
        private userUpdaterepo: IUserUpdateRepository,
        private otpRepo: IOtpRepository,
        private mailService: IMailService
    ) {}

    async registerUser(userData: IUser) {
        const existingUser = await this.userReadrepo.findUserByEmail(userData.email);
        if (existingUser && existingUser.isVerified) {
        throw new Error("User already exists");
         }

          if (existingUser && !existingUser.isVerified) {

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await this.otpRepo.saveOtp(userData.email, otp, 300);
        await this.mailService.sendOtpMail(userData.email, otp);

        console.log("Resent OTP:", otp);

        return existingUser;
    }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = {
            ...userData,
            password: hashedPassword,
            isVerified: false
        };
        const user = await this.userCreaterepo.createUser(newUser);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        await this.otpRepo.saveOtp(userData.email, otp, 300);
        await this.mailService.sendOtpMail(userData.email, otp);
        console.log("otp", otp);

        return user;
    }

  async verifyOtp(email: string, otp: string): Promise<boolean> {

    const storedOtp = await this.otpRepo.getOtp(email);

    console.log("Stored OTP from Redis:", storedOtp);
   console.log("Entered OTP from user:", otp);
    if (!storedOtp) {
        throw new Error("OTP Expired");
    }

    const enteredOtpStr = String(otp).trim();
    const storedOtpStr = String(storedOtp).trim();
    
    console.log(" OTppppppppppps:");
   
    
    if (storedOtpStr !== enteredOtpStr) {
        throw new Error("Invalid OTP");
    }

    const user = await this.userReadrepo.findUserByEmail(email);

    if (user) {
        await this.userUpdaterepo.updateUser(user._id.toString(), { isVerified: true });
    }

    await this.otpRepo.deleteOtp(email);

    return true;
}
    async loginUser(email: string, password: string): Promise<any> {
        const user = await this.userReadrepo.findUserByEmail(email);
        if (!user) {
            throw new Error("user not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        if (!user.isVerified) {
            throw new Error("Please verify your email before logging in.");
        }
        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());
        return {
            user,
            accessToken,
            refreshToken
        };
    }

    async refreshToken(token: string): Promise<{ accessToken: string }> {
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET as string
        );
        const newAccessToken = generateAccessToken(decoded.id);
        return { accessToken: newAccessToken };
    }
    async resendOtp(email: string): Promise<void> {
        
        const user = await this.userReadrepo.findUserByEmail(email)
        if(!user){
            throw new Error("user not found")
        }
        const otp = Math.floor(100000+Math.random()*900000).toString()
        await this.otpRepo.saveOtp(email,otp,300)
        await this.mailService.sendOtpMail(email,otp)

       console.log("Resent OTP:", otp)

    }
    
}
