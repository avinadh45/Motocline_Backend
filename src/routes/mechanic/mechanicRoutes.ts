import express from "express";
import { MechanicController } from "../../controller/mechanic/mechanic";
import { MechanicService } from "../../service/mechanic/mechanicService";
import { MechanicReadRepository } from "../../repository/mechanic/mechanicReadRepository";
import { MechanicWriteRepository } from "../../repository/mechanic/mechanicWriteRepository";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();

const readRepository = new MechanicReadRepository();
const writeRepository = new MechanicWriteRepository();
const service = new MechanicService(readRepository, writeRepository);
const controller = new MechanicController(service);

router.post("/create", authMiddleware, controller.createMechanic.bind(controller));
router.post("/login", controller.loginMechanic.bind(controller));
router.get('/list',authMiddleware,controller.getMechanic.bind(controller))

export default router;
