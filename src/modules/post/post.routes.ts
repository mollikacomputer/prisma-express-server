import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post('/', auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.createPost);
router.get('/allposts',auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.getAllPost);
router.get('/my-posts', auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.getMyPosts);
router.get('/:postId', postController.getPostById);


router.patch('/:postId', auth(Role.USER, Role.ADMIN, Role.AUTHOR), postController.updatePost);


router.delete('/:postId', auth(Role.USER, Role.ADMIN, Role.AUTHOR), postController.deletePost )

export const postRoutes = router;
