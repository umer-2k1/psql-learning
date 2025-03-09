import express, { Router } from "express";
import * as postController from "../controllers/post.controller";

const router: Router = express.Router();

//post
router.route("/").post(postController.createPost);
router.route("/comment").post(postController.addComment);
router.route("/").get(postController.fetchPosts);
router.route("/category").get(postController.postsPerCategory);
router.route("/trending").get(postController.trendingPosts);
router.route("/trending-categories").get(postController.topCategories);

export default router;
