import express, { Router } from "express";
import * as categoryController from "../controllers/category.controller";

const router: Router = express.Router();

//post
router.route("/").post(categoryController.createCategory);

export default router;
