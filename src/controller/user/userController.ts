 import { Request,Response } from "express";
 import { IUserService } from "../../interface/User/IUserService";
 import { HttpStatus } from "../../enums/httpstatus";
 import { OAuth2Client } from "google-auth-library";

 export class UserController {
        
    constructor (private userService : IUserService){}

    private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
            console.log("BODY:", req.body);
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
    async forgetPassword(req:Request,res:Response){
        try {
            const {email} = req.body
            await this.userService.forgotPassword(email)
             res.status(HttpStatus.OK).json({ success:true,message:"Rest link sent to email"})
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
         success: false,
         message: (error as Error).message
         });
        }

    }
    async resetPassword(req:Request,res:Response){
        try {

        const { token,password } = req.body 
        await this.userService.resetPassword(token,password)
        res.status(HttpStatus.OK).json({
            success:true,
            message:"Password reset successfully"
        })

        } catch (error) {

        res.status(HttpStatus.BAD_REQUEST).json({
         success: false,
         message: (error as Error).message
         });
        }
    }
   async googleLogin(req:Request,res:Response):Promise<void>{

    try {

       const {token} = req.body

       const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience:process.env.Client_ID
       }) 

       const payload = ticket.getPayload()
       if(!payload){
        throw new Error("Invalid Google token")
       }
        
       const email = payload.email as string;
       const name = payload.name as string;
       const googleId = payload.sub as string 

       const user = await this.userService.googleLogin({
        email,
        name,
        googleId
       })
        res.status(HttpStatus.OK).json({
      success: true,
      message: "Google login success",
      data: user
       });
    } catch (error) {
         res.status(HttpStatus.BAD_REQUEST).json({
      success:false,
      message:(error as Error).message
    });
    }
   }
   
 }