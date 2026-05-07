import { ICategory } from "./categoryinterface";

export interface ICatergoryCreateRepository{
    createCategory(data:Partial<ICategory>):Promise<ICategory>
    deleteCategory(id:string):Promise<void>
    updateCategory(id:string,data:Partial<ICategory>):Promise<ICategory | null>
   
}
export interface ICategoryReadRepository{
     getAll():Promise<ICategory[]>
     findbyId(id:string):Promise<ICategory | null>
}
