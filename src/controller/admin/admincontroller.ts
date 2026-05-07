import { Request, Response } from "express";
import { MESSAGES } from "../../constants/message";
import { HttpStatus } from "../../enums/httpstatus";
import { IAdminService } from "../../interface/Admin/IAdminService";
import { IServiceCenterService } from "../../interface/ServiceCenter/IServiceCenterService";
import { IUserService } from "../../interface/User/IUserService";

export class AdminController {
  constructor(
    private  adminService: IAdminService,
    private userService: IUserService,
    private serviceCenter: IServiceCenterService,
  ) {}

  async Login(req: Request, res: Response) {
    try {
      const admin = await this.adminService.login(req.body);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.ADMIN.LOGIN_SUCCESS,
        data: admin,
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
  async userList(req: Request, res: Response) {
    try {
      let user = await this.userService.userList();
      return res.status(HttpStatus.OK).json({ data: user });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
  async serviceCenterList(req:Request,res:Response){
    try {
      const serviceCenter = await this.serviceCenter.serviceCenterList()
      return res.status(HttpStatus.OK).json({data:serviceCenter})
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success:false
      })
    }
  }
  async userDetails(req:Request<{id:string}>,res:Response){
    try {
      const {id} = req.params
      const user = await this.userService.getUser(id)
      return res.status(HttpStatus.OK).json({success:true,message:MESSAGES.USER.FETCH_SUCCESS,data:user})
    } catch (error:any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:error.message
      })
    }
  }
  async blockUser(req:Request<{id:string}>,res:Response){
    try {
      const {id} = req.params 
      const user = await this.userService.block(id)
      return res.status(HttpStatus.OK).json({
        success:true,
        message:MESSAGES.USER.BLOCK,
        data:user
      })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:MESSAGES.COMMON.INTERNAL_ERROR
      })
    }
  }
  async serviceCenterDetail(req:Request<{id:string}>,res:Response){

   try {
     const {id} = req.params
    const serviceCenter = await this.serviceCenter.getServiceCenter(id)
    return res.status(HttpStatus.OK).json({success:true,
      message:MESSAGES.SERVICE_CENTER.FETCH_SUCCESS,
      data:serviceCenter})
   } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:MESSAGES.COMMON.INTERNAL_ERROR
    })
   }
  }
  async blockServiceCenter(req:Request<{id:string}>,res:Response){
    try {
      const {id} = req.params
      const serviceCenter = await this.serviceCenter.block(id)
      return res.status(HttpStatus.OK).json({
        success:true,
        message:MESSAGES.SERVICE_CENTER.BLOCK,
        data:serviceCenter
      })
    } catch (error) {
      
       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:MESSAGES.COMMON.INTERNAL_ERROR
      })
    }
  }
}
//     async refreshToken(req: Request, res: Response) {

//   try {

//     const refreshToken = req.body.refreshToken

//     const accessToken = await this.adminService.refreshToken(refreshToken)

//     return res.json({ accessToken })

//   } catch (error: any) {

//     return res.status(HttpStatus.UNAUTHORIZED).json({
//       message: error.message
//     })

//   }
// }
// async toggleUserBlock(req: Request, res: Response) {

//   try {

//     const userId = req.params.userId as string

//     const user = await this.adminService.toggleUserBlock(userId)

//     return res.status(HttpStatus.OK).json({
//       message: "User block status updated",
//       data: user
//     })

//   } catch (error: any) {

//     return res.status(HttpStatus.BAD_REQUEST).json({
//       message: error.message
//     })

//   }

// }
