import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import config from "./config";
import cors from "cors"
import { userRouter } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.routes";
import { postRoutes } from "./modules/post/post.routes";
import { commentRoutes } from "./modules/comment/comment.routes";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { subscriptionRoutes } from "./modules/subscription/subscription.route";



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
app.use('/api/subscription', subscriptionRoutes);


app.use(notFound);

app.use(globalErrorHandler)

export default app;
