import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

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
    const result = await prisma.post.findMany(
        {
            // Filtering / exact match without AND operator
            // //start for search
            // where:{
            //     title:"My third post",
            //     content:"Content of this post goes here"
            // },
             // Filtering / exact match with AND operator
            // where:{
            //     AND:[
            //         {
            //         title:"My third post" 
            //         },
            //         {
            //             content:"Content of this post goes here"
            //         }
            //     ]
            // },
             // Filtering / partial match
            //  where:{
            //     title:{
            //         contains:"RonAldO",
            //         mode:"insensitive"
            //     }
            //  },
            // searching /partial search with OR operator
            // where:{
            //     OR:[
            //         {
            //             title:{
            //                 contains:"Ronaldo",
            //                 mode:"insensitive"
            //             },
            //         },
            //         {
            //             content:{
            //                 contains:"Ronaldo",
            //                 mode:"insensitive"
            //             }
            //         }
            //     ]
            // },
            // combining and search (OR Operator) and filtering (AND)
            // where:{
            //     // filter and  searching combine
            //     AND:[
            //         {
            //             // searching
            //             OR:[
            //                 {
            //                     title:{
            //                         contains:"Ro",
            //                         mode:"insensitive"
            //                     }
            //                 },
            //                 {
            //                     content:{
            //                         contains:"Ro",
            //                         mode:"insensitive"
            //                     }
            //                 }
            //             ]
            //         },

            //         // filtering
            //         {
            //             title:"Ronaldo"
            //         },
            //         {
            //             content:"Ronaldo"
            //         }
            //     ]
            // },
            //end for search
            //pagination
            // take:3,
            // skip:0,

            // page = 3, limit / take = 10 => 
            // skip:(page-1) * limit = (3-1) * 10 = 20

            // sorting in ascending or descending order
            orderBy:{
                createdAt:"desc",
                title:"asc",
                content:"desc"
            },
            include:{
                author:{
                    omit:{
                        password:true
                    }
                },
                comments:true
            },
        
        }
    );
    return result;
    }

const getPostById = async(postId: string)=>{

    const transactionResult = await prisma.$transaction(
        async (tx)=>{
            await tx.post.update({
                 where:{
            id:postId,
        },
        data:{
            views:{
                increment:1
            }
        }

            });
            
            // throw new Error("Fake error");

        const post = await tx.post.findUniqueOrThrow({
                 where:{
            id:postId
        },
        include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:{
                where:{
                    status: CommentStatus.APPROVED
                },
                orderBy:{
                    createdAt:"desc"
                }
            },
            _count:{
                select:{
                    comments:true
                }
            }
        }
            });
            return post;

        }
    );
    return transactionResult;
    }

    const getPostsStats = async() =>{
        const transactionResult = await prisma.$transaction(
            async (tx) =>{
                // const totalPosts = await tx.post.count();

                // const totalPublishedPosts = await tx.post.count({
                //     where:{
                //         status: PostStatus.PUBLISHED
                //     }
                // })

                // const totalDraftPosts = await tx.post.count({
                //     where:{
                //         status: PostStatus.DRAFT
                //     }
                // })

                // const totalArchivedPosts = await tx.post.count({
                //     where:{
                //         status: PostStatus.ARCHIVED
                //     }
                // })

                // const totalComments = await tx.comment.count();
                
                // const totalApprovedComments = await tx.comment.count({
                //     where:{
                //         status:CommentStatus.APPROVED
                //     }
                // })
                // const totalRegectedComments = await tx.comment.count({
                //     where:{
                //         status:CommentStatus.REJECT
                //     }
                // });
                // const totalPostViewsAggregate = await tx.post.aggregate({
                //     _sum:{
                //         views:true
                //     }
                // });
                // const totalPostViews = totalPostViewsAggregate._sum.views;
                // return {
                //     totalPosts,
                //     totalPublishedPosts,
                //     totalDraftPosts,
                //     totalArchivedPosts,
                //     totalComments,
                //     totalApprovedComments,
                //     totalRegectedComments,
                //     totalPostViews
                // }

              const [
                    totalPosts,
                    totalPublishedPosts,
                    totalDraftPosts,
                    totalArchivedPosts,
                    totalComments,
                    totalApprovedComments,
                    totalRegectedComments,
                    totalPostViews
                ] =  await Promise.all([
                await tx.post.count(),

                await tx.post.count({
                    where:{
                        status: PostStatus.PUBLISHED
                    }
                    }),

                await tx.post.count({
                    where:{
                        status: PostStatus.DRAFT
                    }
                }),
                await tx.post.count({
                    where:{
                        status: PostStatus.ARCHIVED
                    }
                }),
                await tx.comment.count(),
                await tx.comment.count({
                    where:{
                        status:CommentStatus.APPROVED
                    }
                }),
                await tx.comment.count({
                    where:{
                        status:CommentStatus.REJECT
                    }
                }),
                await tx.post.aggregate({
                    _sum:{
                        views:true
                    }
                })
                ])
                return {
                    totalPosts,
                    totalPublishedPosts,
                    totalDraftPosts,
                    totalArchivedPosts,
                    totalComments,
                    totalApprovedComments,
                    totalRegectedComments,
                    totalPostViews: totalPostViews._sum.views
                }
            }

        )
        return transactionResult;
    }

    const getMyPosts = async (authorId : string) => {

    const result = await prisma.post.findMany({
        where : {
            authorId
        },

        orderBy : {
            createdAt : "desc"
        },

        include : {
            comments : true,
            author : {
                omit : {
                    password : true
                }
            },

            _count : {
                select : {
                    comments : true
                }
            }
        }
    });

    return result;

    }

const updatePost = async(postId:string, payload:IUpdatePostPayload, authorId:string, isAdmin:boolean ) =>{
    const post = await prisma.post.findUniqueOrThrow({
        where:{
            id: postId
        }
    })
    if(!isAdmin && post.authorId != authorId){
        throw new Error("You are not the owner of this post")
    }
    const result = await prisma.post.update({
        where:{
            id:postId
        },
        data:payload,
        include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:true
        }
    })
    return result;
}

const deletePost = async(postId:string, authorId:string, isAdmin:boolean) =>{
    const post = await prisma.post.findUniqueOrThrow({
        where:{
            id: postId
        }
    })
    if(!isAdmin && post.authorId != authorId){
        throw new Error("You are not the owner of this post")
    }
    const result = await prisma.post.delete({
        where:{
            id: postId
        }
    })
    return result;
}


export const postService = {
    createPostIntoDb,
    getAllPostFromDb,
    getPostById,
    updatePost,
    deletePost,
    getMyPosts,
    getPostsStats
};