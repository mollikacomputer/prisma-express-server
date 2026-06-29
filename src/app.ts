import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors"
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { userRouter } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.routes";
import { postRoutes } from "./modules/post/post.routes";
import { commentRoutes } from "./modules/comment/comment.routes";


const app: Application = express();
app.use(cors({
        origin : config.app_url,
        credentials: true,
    }))
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.get("/", (req:Request, res:Response)=>{
    res.send("Hello Prisma Express server");
});

// app.post()
app.use("/api/users", userRouter);
app.use("/api/auth", authRoutes);

app.use('/api/posts', postRoutes);

app.use('/api/comments', commentRoutes);


export default app;
