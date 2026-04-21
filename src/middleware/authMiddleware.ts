

import { Request, Response, NextFunction } from "express"
import { HttpStatus } from "../enums/httpstatus"
import jwt from "jsonwebtoken"

interface JwtUserPayload {
  id: string
  role: "user" | "serviceCenter" | "mechanic" | "admin"
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: "No token provided"
    })
  }

  const token = authHeader.split(" ")[1]

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as JwtUserPayload

    (req as any).user = decoded

    next()

  } catch (error) {

    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: "unauthorized"
    })

  }
}