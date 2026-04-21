import express from "express"
import { ServiceCenterController } from "../../controller/serviceCenter/serviceCenterController"
import { ServiceCenterService } from "../../service/serviceCenter/serviceCenterService"
import { ServiceCenterRepository } from "../../repository/ServiceCenter/serviceCenterRepository"

const router = express.Router()

const repository = new ServiceCenterRepository()
const service = new ServiceCenterService(repository)
const controller = new ServiceCenterController(service)

router.post("/register",controller.register.bind(controller))
router.post("/login",controller.login.bind(controller))

export default router