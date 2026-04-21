import { IUser } from "./userinterface";

export interface IUserService{
    registerUser(userData:IUser): Promise<IUser | null>
    verifyOtp(email:string,otp:string):Promise<boolean>
    loginUser(email:string,password:string): Promise<any>
    refreshToken(token: string): Promise<{ accessToken: string }>
    resendOtp(email:string):Promise<void>
    forgotPassword(email: string): Promise<void>
    resetPassword(token:string,password:string):Promise<void>
    googleLogin(data: {
    email: string
    name: string
    googleId: string
    }): Promise<any>

}