import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";

const createComment = catchAsync( async(req:Request, res:Response, next: NextFunction)=>{
  
    const result = await commentService.createCommentIntoDb(req.body);
    return result;
    
} )

export const commentController ={
    createComment,
}