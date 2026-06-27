import { NextFunction, Request, RequestHandler, Response} from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import jwt from "jsonwebtoken"
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";


const registerUser = catchAsync( async( req: Request, res:Response, next: NextFunction )=>{
    const payload= req.body;
    const user = await userService.registerUserIntoDB(payload);

    res.status(httpStatus.CREATED).json({
        success:true,
        statusCode: httpStatus.CREATED,
        message:"User register successfully",
        data:{
            user
        }
    });
})

const getMyProfile = catchAsync( async( req: Request, res: Response, next: NextFunction) =>{
   
    // const {accessToken} = req.cookies;
    console.log(req.user,"user request")
    // const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
    
    // if(typeof verifiedToken === "string"){
    //     throw new Error(verifiedToken)
    // }

    const profile = await userService.getMyProfileIntoDB(req.user?.id as string)


    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User profile fetche successfully",
        data:{profile}
    })
});

const updateMyProfile = catchAsync(async(req: Request, res:Response, next: NextFunction)=>{
    const userId = req.user?.id as string;

    const payload = req.body;

    const updateMyProfile = await userService.updateMyProfileFromDB(userId, payload);

    sendResponse(res, {
        success:true,
        statusCode:httpStatus.OK,
        message:"Userprofile updated successfully",
        data:{updateMyProfile}
    })
})

export const userController ={
    registerUser,
    getMyProfile,
    updateMyProfile
}

