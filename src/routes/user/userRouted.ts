import { Router } from "express";
import { UserService } from "../../service/user/userservice";
import { UserController } from "../../controller/user/userController";
import { UserRepository } from "../../repository/userRepository";
import { RedisOtpRepository } from "../../repository/otp/RedisOtpRepository";
import { NodeMailerService } from "../../service/mail/NodeMailerService";
import User from "../../model/Usermodel";

const router = Router()

const userRepository = new UserRepository(User);
const otpRepository = new RedisOtpRepository();
const mailService = new NodeMailerService();

const userService = new UserService(
    userRepository,
    userRepository,
    userRepository, 
    otpRepository,
    mailService
)
const userController = new UserController(userService)

router.post("/register",userController.registerUser.bind(userController))
router.post("/verify-otp",userController.Verifyotp.bind(userController))
router.post("/login",userController.LoginUser.bind(userController))
router.post("/refresh-token",userController.refresnToken.bind(userController))
router.post("/resend-otp",userController.resendOtp.bind(userController))

export default router