import { CategoryResponseDTO } from "../../dto/category/responseDTO";
import { CreateCategoryDTO } from "../../dto/category/createCategoryDTO";
import { UpdateCategoryDTO } from "../../dto/category/updateCtegoryDTO";
 export interface ICategoryService{

    createCategory(data:CreateCategoryDTO):Promise<CategoryResponseDTO>
    getAllCategory():Promise<CategoryResponseDTO[]>
    deleteCategory(id:string):Promise<void>
    updateCategory(id:string,data:UpdateCategoryDTO,file?: Express.Multer.File):Promise<CategoryResponseDTO>
    blockUnblock(id:string):Promise<CategoryResponseDTO>
 }