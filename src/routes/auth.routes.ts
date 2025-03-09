import express, { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router: Router = express.Router();

//post
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/request-email-token").post(authController.requestEmailToken);
router.route("/verify-email").post(authController.verifyEmail);
router.route("/forgot-password").post(authController.forgotPassword);

router.route("/reset-password").put(authController.resetPassword);

export default router;
