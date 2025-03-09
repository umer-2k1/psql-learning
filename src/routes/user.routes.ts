import express, { Router } from "express";
import * as userController from "../controllers/user.controller";

const router: Router = express.Router();

//post
router.route("/").post(userController.createUser);
router.route("/profile").post(userController.createUserProfile);
router.route("/:id").get(userController.getUser);

export default router;
