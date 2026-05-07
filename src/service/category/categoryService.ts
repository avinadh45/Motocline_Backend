import { ICategoryService } from "../../interface/category/ICategoryService";
import {
  ICategoryReadRepository,
  ICatergoryCreateRepository,
} from "../../interface/category/ICategoryRepository";
import { CategoryMapper } from "../../mapper/category/categoryMapper";
import { CreateCategoryDTO } from "../../dto/category/createCategoryDTO";
import { CategoryResponseDTO } from "../../dto/category/responseDTO";
import cloudinary from "../../config/cloudinary";
import { UpdateCategoryDTO } from "../../dto/category/updateCtegoryDTO";

export class CategoryService implements ICategoryService {
  constructor(
    private createrepo: ICatergoryCreateRepository,
    private readRepo: ICategoryReadRepository,
  ) {}

  async createCategory(data: CreateCategoryDTO): Promise<CategoryResponseDTO> {
    const category = await this.createrepo.createCategory(data);
    return CategoryMapper.toResponseDTO(category);
  }
  async getAllCategory(): Promise<CategoryResponseDTO[]> {
    const categories = await this.readRepo.getAll();
    return categories.map(CategoryMapper.toResponseDTO);
  }
  async deleteCategory(id: string): Promise<void> {
    const category = await this.readRepo.findbyId(id);
    if (!category) {
      throw new Error("no category");
    }
    if (category.public_id) {
      await cloudinary.uploader.destroy(category.public_id);
    }
    await this.createrepo.deleteCategory(id);
  }
  async updateCategory(
    id: string,
    data: UpdateCategoryDTO,
    file?: Express.Multer.File,
  ): Promise<CategoryResponseDTO> {
    const category = await this.readRepo.findbyId(id);
    if (!category) {
      throw new Error("category not found");
    }
    let imageURL = category.icon;
    let public_id = category.public_id;
    if (file) {
      if (category.public_id) {
        await cloudinary.uploader.destroy(category.public_id);
      }
      const result = await cloudinary.uploader.upload(file.path);
      imageURL = result.secure_url;
      public_id = result.public_id;
    }
    const upload = await this.createrepo.updateCategory(id, {
      ...data,
      icon: imageURL || "",
      public_id: public_id || "",
    });
    if (!upload) {
      throw new Error("update failed");
    }
    return CategoryMapper.toResponseDTO(upload);
  }

  async blockUnblock(id: string): Promise<CategoryResponseDTO> {
    const category = await this.readRepo.findbyId(id);
    if (!category) {
      throw new Error(" no category found");
    }
    const blockun = category.status === "active" ? "inactive" : "active";
    const data = await this.createrepo.updateCategory(id, { status: blockun });
    if (!data) {
      throw new Error("Update failed");
    }

    return CategoryMapper.toResponseDTO(data);
  }
}
