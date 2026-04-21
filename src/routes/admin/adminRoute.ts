import { Router } from "express"
import { AdminController } from "../../controller/admin/admincontroller"
import { Adminservice } from "../../service/admin/adminservice"
import { UserRepository } from "../../repository/userRepository"

import User from "../../model/Usermodel"

const router = Router()


const userReadRepo = new UserRepository(User)

const adminService = new Adminservice(userReadRepo, userReadRepo)

const adminController = new AdminController(adminService, userReadRepo, userReadRepo)

// router.post("/register", adminController.registerAdmin.bind(adminController))
router.post("/login", adminController.login.bind(adminController))
router.post("/refresh-token", adminController.refreshToken.bind(adminController))
router.patch("/user/:userId/block",adminController.toggleUserBlock.bind(adminController))
export default router