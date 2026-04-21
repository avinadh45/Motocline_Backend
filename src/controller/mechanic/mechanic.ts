import { Request, Response } from "express";
import { MechanicService } from "../../service/mechanic/mechanicService";
import { HttpStatus } from "../../enums/httpstatus";

export class MechanicController {
    constructor(private mechanicService: MechanicService) {}

    async createMechanic(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Email and password are required"
                });
            }

           
            const garageId = (req as any).user?.id;

            if (!garageId) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized: Missing service center context"
                });
            }

            const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

            const newMechanic = await this.mechanicService.createMechanic(garageId,{
                name,
                email,
                password,
                garageId
            });

            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: "Mechanic created successfully",
                data: newMechanic
            });

        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || "Failed to create mechanic"
            });
        }
    }

    async loginMechanic(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Email and password are required"
                });
            }

            const response = await this.mechanicService.loginMechanic(email, password);

            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Login successful",
                data: response
            });

        } catch (error: any) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: error.message || "Login failed"
            });
        }
    }
    async getMechanic(req:Request,res:Response){
        try {
            const serviceCenterId = (req as any).user?.id
             if (!serviceCenterId) {
              return res.status(HttpStatus.UNAUTHORIZED).json({
               message: "Unauthorized"
              })
               }
            const mechanic = await this.mechanicService.getMechanic(serviceCenterId)
            res.status(HttpStatus.OK).json(mechanic)
        } catch (error : any) {
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message})
        }
    }

}
