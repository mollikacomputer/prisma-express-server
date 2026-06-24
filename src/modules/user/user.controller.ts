import { NextFunction, Request, RequestHandler, Response} from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";




// const registerUser = async( req: Request, res: Response)=>{

//    try {
//     const payload = req.body;

//     const user = await userService.registerUserIntoDB(payload);

//     // res.status(httpStatus.CREATED).json({
//     //     success: true,
//     //     statusCode : httpStatus.CREATED,
//     //     message : "User registered successfully",
//     //     data:{
//     //         user
//     //     }
//     //     });

//     sendResponse(res,{
//         success:true,
//         statusCode:httpStatus.CREATED,
//         message:"User registration successfully",
//         data:{user}
//     })

//     } catch (error) {
//         console.log(error);
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success :false,
//             statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//             message: "Faild to register user",
//             error:(error as Error)
//         })
//     }

// }

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

export const userController ={
    registerUser
}