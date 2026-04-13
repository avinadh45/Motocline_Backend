import { Request,Response,NextFunction } from "express";
import { HttpStatus } from "../enums/httpstatus";
import jwt from "jsonwebtoken"

export const authMiddleware=(
    req: Request ,
    res:Response,
    next:NextFunction

)=>{
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(HttpStatus.UNAUTHORIZED).json({
              message: "No token provided"
        })
    }
    const token = authHeader.split(" ")[1]
    try {
        const decode = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string
        )
        req.user = decode
        next()
    } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({
            message:"unauthroised"
        })
        
    }
}