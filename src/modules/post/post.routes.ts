import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post('/', auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.createPost);
router.get('/allposts',auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.getAllPost);
// router.get('/user-post:id', )
// router.patch('/user-post:id', )
// router.delete('/user-post:id', )

export const postRoutes = router;
