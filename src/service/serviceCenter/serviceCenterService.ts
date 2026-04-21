import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { ServiceCenterRepository } from "../../repository/ServiceCenter/serviceCenterRepository"
import { generateAccessToken,generateRefreshToken } from "../../utils/token"

export class ServiceCenterService{

 constructor(private repository:ServiceCenterRepository){}

 async register(data:any){

  const existing = await this.repository.findByEmail(data.email)

  if(existing){
   throw new Error("Service center already exists")
  }


  const hashedPassword = await bcrypt.hash(data.password,10)

  data.password = hashedPassword

  data.providerProfile.location = {
   type: "Point",
   coordinates: [0,0]
 }

  return this.repository.createServiceCenter(data)
 }

 async login(email:string,password:string){

  const provider = await this.repository.findByEmail(email)

  if(!provider){
   throw new Error("Service center not found")
  }

  const providerId = provider._id.toString()
  
  const isMatch = await bcrypt.compare(password,provider.password)

  if(!isMatch){
   throw new Error("Invalid credentials")
  }
 
  const accessToken = generateAccessToken(provider!._id.toString())
  const  refreshToken = generateRefreshToken(provider!._id.toString())


  return {
  provider,
   accessToken,
   refreshToken
  }
 }

 async refreshToken(token: string): Promise<{ accessToken: string }> {
  const decoded: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
  );
  const newAccessToken = generateAccessToken(decoded.id);
  return { accessToken: newAccessToken };
 }

}