import { Request, Response } from "express";
import { IMechanicService } from "../../interface/Machanic/IMechanicservice";
import { HttpStatus } from "../../enums/httpstatus";
import { MESSAGES } from "../../constants/message";

export class MechanicController {
  constructor(private mechanicService: IMechanicService) {}

  async createMechanic(req: Request, res: Response) {
    try {
      let serviceCenterId = (req as any).user?.id;
      if (!serviceCenterId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.COMMON.UNAUTHORIZED,
        });
      }
      const data = { ...req.body, garageId: serviceCenterId };
      const serviceCenter = await this.mechanicService.createMechanic(data);
      return res
        .status(HttpStatus.CREATED)
        .json({ success: true, data: serviceCenter });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMechanic(req: Request, res: Response) {
    try {
      const serviceCenterId = (req as any).user?.id;
      if (!serviceCenterId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.COMMON.UNAUTHORIZED,
        });
      }
      const mechanic = await this.mechanicService.getMechanics(serviceCenterId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: mechanic,
      });
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }

  async loginMechanic(req: Request, res: Response) {
    console.log("loginMechanic heree", req.body);
    try {
      const { email, password } = req.body;
      const mechanic = await this.mechanicService.login({ email, password });
      return res.status(HttpStatus.OK).json({
        success: true,
        data: mechanic,
      });
    } catch (error: any) {
      console.log("Error in loginMechanic:", error);
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}
