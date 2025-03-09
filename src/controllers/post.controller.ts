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
const fetchPosts = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['post']
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const { search } = req.query || "";
    const [posts, count] = await Promise.all([
      prisma.post.findMany({
        where: {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.count(),
    ]);
    return SuccessHandler({ posts, count }, 200, res);
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
// No of posts in each category
const postsPerCategory = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['post']
  try {
    const posts = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
    return SuccessHandler(posts, 200, res);
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const trendingPosts = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['post']
  try {
    const posts = await prisma.post.findMany({
      where: {
        comments: {
          some: {
            createdAt: {
              gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 24 hours
            },
          },
        },
      },
      orderBy: {
        comments: { _count: "desc" },
      },
      take: 2,
    });
    return SuccessHandler(posts, 200, res);
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// Find the categories have the most posts.
const topCategories = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['post']
  try {
    const posts = await prisma.category.findMany({
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      take: 3,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
    return SuccessHandler(posts, 200, res);
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
// Creating a Post with a Comment
const createPostWithComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  // #swagger.tags = ['post']
  try {
    const { title, content, authorId, categoryIds, comment } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
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
      const addComment = await tx.comment.create({
        data: {
          content: comment,
          author: { connect: { id: authorId } },
          post: { connect: { id: post.id } },
        },
      });

      return { post, addComment };
    });

    return SuccessHandler(
      { data: result, message: "Transaction successful!" },
      201,
      res
    );
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
    console.error("Transaction failed:", error);
  }
};

export {
  createPost,
  addComment,
  fetchPosts,
  postsPerCategory,
  trendingPosts,
  topCategories,
};
