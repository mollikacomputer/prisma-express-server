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

});

const getPostById = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const postId = req.params.postId;

    if(!postId){
        throw new Error("Post Id Required In Params")
    }

    const result = await postService.getPostById(postId as string);

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "Post retrieved successfuly",
        data : result
    })
});

const getPostStatus = catchAsync( async(req:Request, res:Response, next: NextFunction)=>{
    const result = await postService.getPostsStats();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post status retrived successfully",
        data: result
    })
})

const getMyPosts = catchAsync( async (req: Request, res:Response, next: NextFunction)=>{
    const authorId = req.user?.id;

    const result = await postService.getMyPosts(authorId as string)

    sendResponse(res, {
    success:true,
    statusCode: httpStatus.OK,
    message:"My post retrived successfully",
    data:{
        result
        }
        });
});

const updatePost = catchAsync(async(req: Request, res:Response, next: NextFunction)=>{
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";


    const postId = req.params.postId;

        if(!postId){
        throw new Error("Post Id Required In Params")
        }

    const payload = req.body;
    const result = await postService.updatePost(postId as string, payload, authorId as string, isAdmin)

    sendResponse(res, {
        success:true,
        statusCode:httpStatus.OK,
        message:"Post updated successfully",
        data:result
    })
})

const deletePost = catchAsync(async(req: Request, res:Response, next: NextFunction)=>{
     const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;
        if(!postId){
        throw new Error("Post Id Required In Params")
        }

    const result = await postService.deletePost(postId as string, authorId as string, isAdmin)

    sendResponse(res, {
        success:true,
        statusCode:httpStatus.OK,
        message:"Post deleted successfully",
        data:result
    })
})



export const postController ={
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost,
    getPostStatus
}