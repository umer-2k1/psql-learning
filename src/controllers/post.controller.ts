import { Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import SuccessHandler from "../utils/SuccessHandler";
import prisma from "../config/prisma";

const createPost = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['post']
  try {
    const { title, content, authorId, categoryIds } = req.body;
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: authorId } },
        categories:
          categoryIds && categoryIds.length > 0
            ? { connect: categoryIds.map((id: string) => ({ id })) }
            : undefined,
      },
    });
    return SuccessHandler(
      { data: newPost.id, message: "Post created successfully" },
      201,
      res
    );
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const addComment = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['post']
  try {
    const { comment, authorId, postId } = req.body;
    const newComment = await prisma.comment.create({
      data: {
        content: comment,
        author: { connect: { id: authorId } },
        post: { connect: { id: postId } },
      },
    });
    return SuccessHandler(
      { data: newComment.id, message: "Comment added successfully" },
      201,
      res
    );
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
export { createPost, addComment };
