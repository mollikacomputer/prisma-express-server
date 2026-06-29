import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import httpStatus from "http-status"
import { sendResponse } from "../../utils/sendResponse";

const createPost = catchAsync( async(req:Request, res:Response, next: NextFunction)=>{
    const id = req.user?.id;
    const payload = req.body;

    const result = await postService.createPostIntoDb(payload, id as string);
    console.log(result)

        sendResponse(res, {
           success:true,
            statusCode: httpStatus.CREATED,
            message:"Post created successfully",
            data:{
            result
                }
        });
});

const getAllPost = catchAsync( async(req:Request, res:Response, next:NextFunction) =>{
    const result = await postService.getAllPostFromDb();

    sendResponse(res, {
    success:true,
    statusCode: httpStatus.OK,
    message:"All post shown successfully",
    data:{
        result
        }
        });

})



export const postController ={
    createPost,
    getAllPost
}