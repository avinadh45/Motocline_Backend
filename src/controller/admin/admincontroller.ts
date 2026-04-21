import {Request,Response} from "express"
import { Adminservice} from "../../service/admin/adminservice"
import { MESSAGES } from "../../constants/message"
import { HttpStatus } from "../../enums/httpstatus"
import { IUserCreateRepository } from "../../interface/User/IUserCreateRepository"
import { IUserReadRepository } from "../../interface/User/IUserReadRepository"
import { IUser } from "../../interface/User/userinterface"
import bcrypt from "bcrypt"

export class AdminController{

    constructor(
        private adminService : Adminservice,
        private userCreateRepo: IUserCreateRepository,
        private userReadRepo: IUserReadRepository
    ){} 
    async login(req:Request , res: Response){
    
        try {
          console.log("Admin login body:", req.body)
             const data = await this.adminService.login(req.body)
             return res.status(HttpStatus.OK).json({message:MESSAGES.ADMIN.LOGIN_SUCCESS,data})
        } catch (error:any) {
           return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message || MESSAGES.COMMON.INTERNAL_ERROR}) 
        }

    }
    
    async refreshToken(req: Request, res: Response) {

  try {

    const refreshToken = req.body.refreshToken

    const accessToken = await this.adminService.refreshToken(refreshToken)

    return res.json({ accessToken })

  } catch (error: any) {

    return res.status(401).json({
      message: error.message
    })

  }
}
async toggleUserBlock(req: Request, res: Response) {

  try {

    const userId = req.params.userId as string

    const user = await this.adminService.toggleUserBlock(userId)

    return res.status(HttpStatus.OK).json({
      message: "User block status updated",
      data: user
    })

  } catch (error: any) {

    return res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message
    })

  }

}
}