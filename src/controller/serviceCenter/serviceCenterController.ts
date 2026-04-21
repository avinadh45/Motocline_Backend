import { Request, Response } from "express"
import { ServiceCenterService } from "../../service/serviceCenter/serviceCenterService"

export class ServiceCenterController{

 constructor(private service:ServiceCenterService){}

 async register(req:Request,res:Response){

  const result = await this.service.register(req.body)

  res.status(201).json({
   success:true,
   data:result
  })
 }

async login(req: Request, res: Response) {
 try {

  const { email, password } = req.body;

  const result = await this.service.login(email, password);

  res.status(200).json({
   success: true,
   data: result
  });

 } catch (error: any) {

  res.status(400).json({
   success: false,
   message: error.message
  });

 }
}

async refreshToken(req: Request, res: Response) {

 const { refreshToken } = req.body;

 if (!refreshToken) {
  return res.status(401).json({
   message: "Refresh token required"
  });
 }

 const result = await this.service.refreshToken(refreshToken);

 res.json(result);
}

}