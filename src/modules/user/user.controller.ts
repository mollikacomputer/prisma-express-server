import { NextFunction, Request, RequestHandler, Response} from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";


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
    res.send("Get my Profile");
})

export const userController ={
    registerUser,
    getMyProfile
}

