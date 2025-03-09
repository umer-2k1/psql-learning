import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const handleInvalidRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return ErrorHandler(
    `The Requested Route ${req.hostname + req.originalUrl} Not Found`,
    404,
    req,
    res
  );
};
