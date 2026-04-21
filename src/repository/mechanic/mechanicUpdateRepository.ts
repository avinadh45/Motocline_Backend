import { IMechanicUpdateRepository } from "../../interface/Machanic/IMechanicReadRepository";


export class MechanicUpdateRepository implements IMechanicUpdateRepository{

    async save(mechanic:any){
        return await mechanic.save()
    }
}