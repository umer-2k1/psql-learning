import { Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import SuccessHandler from "../utils/SuccessHandler";
import prisma from "../config/prisma";

//Create a new user
const createUser = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['user']
  try {
    const { name, email } = req.body;
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return SuccessHandler(
      { data: newUser.id, message: "User created successfully" },
      201,
      res
    );
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getUser = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['user']
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        posts: true,
        comments: true,
      },
    });
    return SuccessHandler(user, 200, res);
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const createUserProfile = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['user']
  try {
    const { bio, avatarUrl, userId } = req.body;
    const newProfile = await prisma.userProfile.create({
      data: {
        bio,
        avatarUrl,
        user: { connect: { id: userId } },
      },
    });
    return SuccessHandler(
      { data: newProfile.id, message: "User Profile created successfully" },
      201,
      res
    );
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteUser = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['user']
  try {
    const { id } = req.params;
    const user = await prisma.user.delete({
      where: { id },
    });
    return SuccessHandler(
      { data: user.id, message: "User deleted successfully" },
      200,
      res
    );
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const userStats = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['user']
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });
    return SuccessHandler(user, 200, res);
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const usersWithLatestPost = async (
  req: Request,
  res: Response
): Promise<any> => {
  // #swagger.tags = ['user']
  try {
    console.log("I am here");

    const users = await prisma.user.findMany({
      // include: {
      //   posts: {
      //     take: 1,
      //     orderBy: { createdAt: "desc" },
      //   },
      // },
    });
    return SuccessHandler(users, 200, res);
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

export {
  createUser,
  createUserProfile,
  getUser,
  deleteUser,
  userStats,
  usersWithLatestPost,
};
