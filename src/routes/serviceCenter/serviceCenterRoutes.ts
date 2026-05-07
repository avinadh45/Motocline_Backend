import express from "express"
import { ServiceCenterController } from "../../controller/serviceCenter/serviceCenterController"
import { ServiceCenterService } from "../../service/serviceCenter/serviceCenterService"
import { ServiceCenterRepository } from "../../repository/ServiceCenter/serviceCenterRepository"
import { MechanicReadRepository } from "../../repository/mechanic/mechanicReadRepository";
import { MechanicWriteRepository } from "../../repository/mechanic/mechanicWriteRepository";
import { NodeMailerService } from "../../service/mail/NodeMailerService";
import { MechanicService } from "../../service/mechanic/mechanicService";
const router = express.Router()

const mailService = new NodeMailerService();
const repository = new ServiceCenterRepository()

const readRepository = new MechanicReadRepository();
const writeRepository = new MechanicWriteRepository();
const service = new ServiceCenterService(repository,mailService)
const mechanicService = new MechanicService(readRepository,writeRepository)
const controller = new ServiceCenterController(service,mechanicService)

router.post("/register",controller.register.bind(controller))
router.post("/login",controller.login.bind(controller))
router.post("/forgot-password",controller.forgotPassword.bind(controller))
router.post("/reset-password",controller.resetPassword.bind(controller))
router.patch("/block/:id",controller.blockMechanic.bind(controller))
export default router