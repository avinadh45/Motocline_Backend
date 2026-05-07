import { IServiceCenter } from "./IServiceCenter";
import { ServiceCenterRegisterDTO } from "../../dto/serviceCenter/RegisterDTO";
import { ServiceCenterLogin } from "../../dto/serviceCenter/LoginDTO";
import { serviceCenterDetailsDTO } from "../../dto/admin/serviceCenterDetails";
import { servicecenterDTO } from "../../dto/admin/ServiceCenterListDTO";
import { ForgotPasswordDTO } from "../../dto/serviceCenter/forgotDTO";
import { ResetPasswordDTO } from "../../dto/serviceCenter/resetPassword";
export interface IServiceCenterService{
    register(dto:ServiceCenterRegisterDTO):Promise< IServiceCenter | null>
    login(dto:ServiceCenterLogin):Promise<any>
    refreshToken(token:string):Promise<{accessToken :string}>
    serviceCenterList():Promise<servicecenterDTO[]>
    getServiceCenter(id:string):Promise<serviceCenterDetailsDTO>
    block(id:string):Promise<serviceCenterDetailsDTO>
    forgotpassword(email:ForgotPasswordDTO):Promise<void>
    resetPassword(dto:ResetPasswordDTO):Promise<void>
}