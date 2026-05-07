import { IServiceCenter } from "../../interface/ServiceCenter/IServiceCenter";
import { ServiceCenterRegisterDTO } from "../../dto/serviceCenter/RegisterDTO";
import { ServiceCenterResponseDTO } from "../../dto/serviceCenter/ServiceCenterResponseDTO."; 
import { servicecenterDTO } from "../../dto/admin/ServiceCenterListDTO";
import { serviceCenterDetailsDTO } from "../../dto/admin/serviceCenterDetails";
export class ServiceCenterMapper{
    static toEntity(dto:ServiceCenterRegisterDTO):Partial<IServiceCenter>{
        return {
            email:dto.email ,
            password:dto.password,
            providerProfile : {
                ownerName:dto.providerProfile.ownerName,
                garageName:dto.providerProfile.garageName,
                phone:dto.providerProfile.phone,
                location:{
                    type:"Point",
                    coordinates:[0,0]
                }
            }
        }
    }
    static authResponse(
        entity: IServiceCenter,
        accessToken:string,
        refreshToken:string
    ) : ServiceCenterResponseDTO{
        return{
            id: entity._id.toString(),
            email:entity.email,
            name:entity.providerProfile.ownerName,
            garageName:entity.providerProfile.garageName,
            accessToken,
            refreshToken
        }
    }
    static toListDTO(entity:IServiceCenter):servicecenterDTO{
        return{
        id: entity._id.toString(),
        name: entity.providerProfile.garageName,
        ownerName: entity.providerProfile.ownerName,
        email: entity.email,
        phoneNumber: entity.providerProfile.phone,
        isBlocked: entity.isBlocked,
        
        }
    }
    static toDetailsDTO(entity:IServiceCenter):serviceCenterDetailsDTO{
        return {
         id: entity._id.toString(),
        name: entity.providerProfile.garageName,
        ownerName: entity.providerProfile.ownerName,
        email: entity.email,
        phoneNumber: entity.providerProfile.phone,
        isBlocked: entity.isBlocked ?? false,
        createdAt: entity.createdAt
        }
    }
}
