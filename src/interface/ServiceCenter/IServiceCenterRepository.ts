import { IServiceCenter } from "./IServiceCenter";

export interface IServiceCenterRepository{
    
    findByEmail(email:string):Promise<IServiceCenter | null>
    createServiceCenter(data:Partial<IServiceCenter>): Promise< IServiceCenter>

}