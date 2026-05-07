import { Router } from "express";
import { CategoryController } from "../../controller/category/categoryController";
import { CategoryService } from "../../service/category/categoryService";
import { Category} from "../../model/categoryModel"

import { CategoryRepository } from "../../repository/category/CategoryRepository";
import { upload } from "../../middleware/upload";
import { verifyAdmin } from "../../middleware/verifyAdmin";
const  router = Router();

const repo = new CategoryRepository(Category)
const service = new CategoryService(repo,repo)
const controller = new CategoryController(service)

router.post("/categorys",upload.single("icon"),controller.createCategory.bind(controller))
router.get("/categorys",controller.getCategory.bind(controller))
router.delete("/categorys/:id",controller.deleteCategory.bind(controller))
router.put("/categorys/:id",upload.single("icon"),controller.updateCategory.bind(controller))
router.patch("/categorys/:id/status",controller.block.bind(controller))
export default router