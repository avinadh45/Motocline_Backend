import { IServiceCenter } from "./IServiceCenter";

export interface IServiceCenterRepository{
    
    findByEmail(email:string):Promise<IServiceCenter | null>
    createServiceCenter(data:Partial<IServiceCenter>): Promise< IServiceCenter>
    findServiceCenterByToken(token:string):Promise<IServiceCenter | null>
    findById(id:string):Promise<IServiceCenter | null>
    findAll():Promise<IServiceCenter[]>
    updateServiceCenter(id:string,data:Partial<IServiceCenter>):Promise<IServiceCenter | null>
}