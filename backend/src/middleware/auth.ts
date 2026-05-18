import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function verifyToken(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    const err = new Error("Authentication required") as any;
    err.status = 401;
    throw err;
  }
  const token = header.slice(7);
  const secret = process.env.JWT_SECRET ?? "fallback_secret";
  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    const err = new Error("Invalid or expired token") as any;
    err.status = 401;
    throw err;
  }
}
