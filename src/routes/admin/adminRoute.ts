import { Router } from "express";
import { AdminController } from "../../controller/admin/admincontroller";
import { Adminservice } from "../../service/admin/adminservice";
import { authMiddleware } from "../../middleware/authMiddleware";
import User from "../../model/Usermodel";
import { UserService } from "../../service/user/userservice";
import { UserRepository } from "../../repository/userRepository";
import { RedisOtpRepository } from "../../repository/otp/RedisOtpRepository";
import { NodeMailerService } from "../../service/mail/NodeMailerService";
import { ServiceCenterService } from "../../service/serviceCenter/serviceCenterService";
import { ServiceCenterRepository } from "../../repository/ServiceCenter/serviceCenterRepository";

const router = Router();

const userRepo = new UserRepository(User);
const otpRepository = new RedisOtpRepository();
const mailService = new NodeMailerService();
const serviceCenterRepo = new ServiceCenterRepository()
const userService =  new UserService( userRepo,
    userRepo,
    userRepo, 
    otpRepository,
    mailService)

const adminService = new Adminservice(userRepo);
const serviceCenterService = new ServiceCenterService( serviceCenterRepo,mailService)
const adminController = new AdminController(adminService,userService,serviceCenterService);

router.post("/login", adminController.Login.bind(adminController));

router.get("/userList",adminController.userList.bind(adminController))
router.get("/serviceCenterList",adminController.serviceCenterList.bind(adminController))
router.get("/users/:id",adminController.userDetails.bind(adminController))
router.patch("/users/:id/block",adminController.blockUser.bind(adminController))
router.get("/serviceCenter/:id",adminController.serviceCenterDetail.bind(adminController))
router.patch("/serviceCenter/:id/block",adminController.blockServiceCenter.bind(adminController))
export default router;