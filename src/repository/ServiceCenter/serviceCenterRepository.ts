import ServiceCenter from "../../model/ServiceCenterModel";
import { IServiceCenter } from "../../interface/ServiceCenter/IServiceCenter";
import { IServiceCenterRepository } from "../../interface/ServiceCenter/IServiceCenterRepository";


export class ServiceCenterRepository implements IServiceCenterRepository{

    async findByEmail(email: string): Promise<IServiceCenter | null> {
        return ServiceCenter.findOne({email})
    }

    async createServiceCenter(data: Partial<IServiceCenter>): Promise<IServiceCenter> {
        return ServiceCenter.create(data)
    }
}