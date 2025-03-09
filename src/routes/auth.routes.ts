import express, { Router } from "express";
import * as authController from "../controllers/auth.controller";
import isAuthenticated from "../middleware/auth.middleware";

const router: Router = express.Router();
//get
router.route("/logout").post(isAuthenticated, authController.logout);
//post
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/request-email-token").post(authController.requestEmailToken);
router.route("/verify-email").post(authController.verifyEmail);
router.route("/forgot-password").post(authController.forgotPassword);

router.route("/reset-password").put(authController.resetPassword);
router
  .route("/update-password")
  .put(isAuthenticated, authController.updatePassword);

export default router;
