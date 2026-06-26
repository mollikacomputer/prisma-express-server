import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Role } from "../../generated/prisma/enums";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global{
    namespace Express{
        interface Request{
            user?:{
                id:string;
                name: string;
                email:string;
                role: Role;
            }
        }
    }
}

// auth(Role.USER, Role.ADMIN, Role.AUTHOR)
export const auth = (...requiredRoles:Role[]) =>{
    return catchAsync( async(req: Request, res: Response, next: NextFunction)=>{
        const token = req.cookies.accessToken
        ? req.cookies.accessToken
        :req.headers.authorization?.startsWith("Bearer") ?
          req.headers.authorization?.split(" ")[1] 
        :req.headers.authorization;

        if(!token){
            throw new Error("You are not logged in. Please log in to access this resource.");
        }
        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if(!verifiedToken.success){
            throw new Error(verifiedToken.error);
        }
         const {id, name, email, role } = verifiedToken.data as JwtPayload;
         if(requiredRoles.length && !requiredRoles.includes(role)){
            throw new Error("Forbidden. You don't have perission to access this resource.")
         }

         const user = await prisma.user.findUnique({
            where:{
                id,
                email,
                name,
                role
            }
         });

         if(!user){
            throw new Error("User not found. Please log in again.");
         }
         
         if(user.activeStatus === "BLOCKED"){
            throw new Error("Your account has been blocked. Please contact with support")
         }
         req.user = {
                id,
                email,
                name,
                role
         }
         next();
    }
)
}