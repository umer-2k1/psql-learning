import { Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import SuccessHandler from "../utils/SuccessHandler";
import prisma from "../config/prisma";

const createCategory = async (req: Request, res: Response): Promise<any> => {
  // #swagger.tags = ['post']
  try {
    const { name } = req.body;
    const newCategory = await prisma.category.create({
      data: { name },
    });
    return SuccessHandler(
      { data: newCategory.id, message: "Category created successfully" },
      201,
      res
    );
  } catch (error: any) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
export { createCategory };
