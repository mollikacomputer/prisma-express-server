import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import  httpStatus  from "http-status";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { auth } from "../../middleware/auth";
const router = Router();


router.post("/register", userController.registerUser);
router.get("/me", auth(Role.ADMIN, Role.AUTHOR, Role.USER),
userController.getMyProfile);

export const userRouter = router;