 import { Request,Response } from "express";
 import { IUserService } from "../../interface/User/IUserService";
 import { HttpStatus } from "../../enums/httpstatus";

 export class UserController {

    constructor (private userService : IUserService){}

    async registerUser(req:Request,res:Response):Promise<void>{
        try {  
            const register = await this.userService.registerUser(req.body)
            res.status(HttpStatus.OK).json({success:true,message:"success",data:register})
        } catch (error) {
            
            res.status(HttpStatus.BAD_REQUEST).json({success:false,message:(error as Error).message})
        }
    }
    async Verifyotp(req:Request,res:Response):Promise<void>{
        try {
            
            const {email,otp} = req.body 
            const user = await this.userService.verifyOtp(email,otp)
            res.status(HttpStatus.OK).json({
                success:"true",
                message:"otp verified successfully",
                data:user
            })
        } catch (error) {
           
            res.status(HttpStatus.BAD_REQUEST).json({
                success : false,
                message: (error as Error).message
            })
        }
    }
    async LoginUser(req:Request,res:Response):Promise<void>{
        try {
            const {email,password} = req.body 
            const user = await this.userService.loginUser(email,password)
            res.status(HttpStatus.OK).json({success:true,message:"login success",data:user})

        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                success:false,message:(error as Error).message
            })

        }
    }
    async refresnToken(req:Request,res:Response){
        const {refreshToken} = req.body
        if(!refreshToken){
            return res.status(HttpStatus.UNAUTHORIZED).json({message: "Refresh token required"  })
        }
        try {
            const result = await this.userService.refreshToken(refreshToken);
            res.json(result);
        } catch (error) {
           res.status(HttpStatus.UNAUTHORIZED).json({message:"invalid refresh"}) 
        }
    }

    async resendOtp(req:Request,res:Response){
        try {
            const  {email} = req.body

            if(!email){
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false ,
                     message:"email is required"
                })
            }
            await this.userService.resendOtp(email)
            return res.status(HttpStatus.OK).json({
                success: true,
                message: "OTP resent successfully"
            })
        } catch (error:any) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            })
        }
    }
    

    
 }