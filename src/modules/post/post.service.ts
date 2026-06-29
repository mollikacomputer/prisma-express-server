import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPostIntoDb = async (payload: ICreatePostPayload, userId:string) => {
    const result = await prisma.post.create({
        data:{
            ...payload,
            authorId: userId,
        }
    })

    return result;
};

const getAllPostFromDb = async () =>{
    const result = await prisma.post.findMany({
        include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:true
        },
        
    });
    return result;
}

const getPostById = ()=>{

}

const updatePost = () =>{

}

const deletePost = () =>{

}
const getPostStatus = () =>{

}
export const postService = {
    createPostIntoDb,
    getAllPostFromDb,
    getPostById,
    updatePost,
    deletePost,
    getPostStatus
};