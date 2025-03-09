import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  const allowOrigins = ["http://localhost:3000", "http://localhost:3001"]; // add your own domains here

  next();
}
