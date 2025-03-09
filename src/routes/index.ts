import express, { Router } from "express";
import auth from "./auth.routes";
import user from "./user.routes";
import post from "./post.routes";
import category from "./category.routes";

const router: Router = express.Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/post", post);
router.use("/category", category);

export default router;
