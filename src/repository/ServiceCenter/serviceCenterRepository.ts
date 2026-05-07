import ServiceCenter from "../../model/ServiceCenterModel";
import { IServiceCenter } from "../../interface/ServiceCenter/IServiceCenter";
import { IServiceCenterRepository } from "../../interface/ServiceCenter/IServiceCenterRepository";


export class ServiceCenterRepository implements IServiceCenterRepository{

    async findByEmail(email: string): Promise<IServiceCenter | null> {
        return ServiceCenter.findOne({email})
    }

    async   findServiceCenterByToken(token:string):Promise<IServiceCenter | null>{
        return await ServiceCenter.findOne({resetToken: token})
    }
    async createServiceCenter(data: Partial<IServiceCenter>): Promise<IServiceCenter> {
        return ServiceCenter.create(data)
    }
    async findAll():Promise<IServiceCenter[]>{
        return ServiceCenter.find().sort({createdAt: 1})
    }
    async findById(id: string): Promise<IServiceCenter | null> {
        return ServiceCenter.findById(id)
    }
    async updateServiceCenter(id: string, data: Partial<IServiceCenter>): Promise<IServiceCenter | null> {
        return await ServiceCenter.findByIdAndUpdate(id,data,{returnDocument:"after"})
    }
}