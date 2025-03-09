import express, { Router } from "express";
import * as userController from "../controllers/user.controller";

const router: Router = express.Router();

//post
router.route("/").post(userController.createUser);
router.route("/profile").post(userController.createUserProfile);
router.route("/:id").get(userController.getUser);
router.route("/:id").delete(userController.deleteUser);
router.route("/stats/:id").get(userController.userStats);
router.route("/latest-posts").get(userController.usersWithLatestPost);

export default router;
