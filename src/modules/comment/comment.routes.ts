import { Router } from "express";
import { commentController } from "./comment.controller";

const router = Router();

router.post('/user-comments', commentController.createComment);

export const commentRoutes = router;