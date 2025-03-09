import logger from "../functions/logger";
import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  logger.info({
    method: req.method,
    url: req.url,
    date: new Date(),
    message: "Request received",
  });
  next();
}
