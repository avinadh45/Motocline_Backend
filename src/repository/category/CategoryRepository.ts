import { Model } from "mongoose";
import { ICategory } from "../../interface/category/categoryinterface";

import { ICategoryReadRepository, ICatergoryCreateRepository } from "../../interface/category/ICategoryRepository";
export class CategoryRepository implements ICatergoryCreateRepository,ICategoryReadRepository {
  constructor(private Model: Model<ICategory>) {}

  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    return await this.Model.create(data);
  }
  async getAll(): Promise<ICategory[]> {
      return await this.Model.find().sort({ createdAt:-1})
  }
  async deleteCategory(id:string):Promise<void>{
     await this.Model.findByIdAndDelete(id)
  }
  async findbyId(id: string): Promise<ICategory | null> {
      return this.Model.findById(id)
  }
  async updateCategory(id: string,data: Partial<ICategory>): Promise<ICategory | null> {

  return await this.Model.findByIdAndUpdate(id,{ $set: data },{ returnDocument: "after" });
}
}
