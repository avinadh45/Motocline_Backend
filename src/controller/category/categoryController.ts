import { Request, Response } from "express";

import { ICategoryService } from "../../interface/category/ICategoryService";
import { HttpStatus } from "../../enums/httpstatus";
import { MESSAGES } from "../../constants/message";
import { upload } from "../../middleware/upload";

export class CategoryController {
  constructor(private category: ICategoryService) {}

  async createCategory(req: Request, res: Response) {
    try {
      const { name, advanceFee } = req.body;
      const file = req.file as any;
      const icon = file?.path;
      const public_id = file?.filename;
      console.log("FILE:", req.file);
      const result = await this.category.createCategory({
        name,
        advanceFee: Number(advanceFee),
        icon,
        public_id,
      });
      return res.status(HttpStatus.CREATED).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getCategory(req: Request, res: Response) {
    try {
      const categories = await this.category.getAllCategory();
      return res.status(HttpStatus.OK).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async deleteCategory(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      await this.category.deleteCategory(id);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: MESSAGES.ADMIN.DELETE_CATEGORY });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  async updateCategory(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const file = req.file;
      const update = await this.category.updateCategory(id, data, file);
      return res.status(HttpStatus.OK).json({ success: true, data: update });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
  async block(req:Request<{id:string}>,res:Response){
    
    try {
      const {id} = req.params
      const updated = await this.category.blockUnblock(id)
      return res.status(HttpStatus.OK).json({success:true,data:updated})
    } catch (err : any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success:false,message:err.message})
    }
  }
}
