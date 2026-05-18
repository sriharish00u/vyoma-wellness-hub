import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;
  const message = err.message ?? "Internal server error";
  console.error(`[ERROR] ${status} - ${message}`);
  res.status(status).json({ error: message });
}
