import { Response, Request, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export default (exec: AsyncFunction) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  exec(req, res, next).catch(next);
};
