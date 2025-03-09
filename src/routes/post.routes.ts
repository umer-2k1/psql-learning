import express, { Router } from "express";
import * as postController from "../controllers/post.controller";

const router: Router = express.Router();

//post
router.route("/").post(postController.createPost);
router.route("/comment").post(postController.addComment);

export default router;
