import { Request, Response } from "express";
import { IServiceCenterService } from "../../interface/ServiceCenter/IServiceCenterService";
import { HttpStatus } from "../../enums/httpstatus";
import { ServiceCenterLogin } from "../../dto/serviceCenter/LoginDTO";
import { MESSAGES } from "../../constants/message";
import { ForgotPasswordDTO } from "../../dto/serviceCenter/forgotDTO";
import { ResetPasswordDTO } from "../../dto/serviceCenter/resetPassword";
import { IMechanicService } from "../../interface/Machanic/IMechanicservice";

export class ServiceCenterController {
  constructor(
    private service: IServiceCenterService,
    private mechanicService: IMechanicService,
  ) {}

  async register(req: Request, res: Response) {
    const serviceCenter = await this.service.register(req.body);
    return res.status(HttpStatus.CREATED).json(serviceCenter);
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const dto: ServiceCenterLogin = {
        email,
        password,
      };
      const serviceCenter = await this.service.login(dto);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.USER.LOGIN_SUCCESS,
        data: serviceCenter,
      });
    } catch (error: any) {
      res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: error.message,
      });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const data: ForgotPasswordDTO = req.body;
      await this.service.forgotpassword(data);
      res.status(HttpStatus.OK).json({
        message: MESSAGES.SERVICE_CENTER.FORGOT_PASSWORD,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const dto: ResetPasswordDTO = req.body;
      await this.service.resetPassword(dto);
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.SERVICE_CENTER.PASSWORD_CHANGE,
      });
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: (error as Error).message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    const result = await this.service.refreshToken(refreshToken);

    res.json(result);
  }

  async blockMechanic(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const mechanic = await this.mechanicService.block(id);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.SERVICE_CENTER.BLOCK,
        data: mechanic,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.COMMON.INTERNAL_ERROR,
      });
    }
  }
}
