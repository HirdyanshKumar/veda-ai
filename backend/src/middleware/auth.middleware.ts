import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      clerkToken?: string;
    }
  }
}

export const verifyAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Extract auth header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: "No authorization token provided",
        code: "UNAUTHORIZED"
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const verifiedToken = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });

    // 3. Extract userId (sub)
    const userId = verifiedToken.sub;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload",
        code: "UNAUTHORIZED"
      });
      return;
    }

    // 4. Attach to request
    req.userId = userId;
    req.clerkToken = token;

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Invalid or expired token",
      code: "UNAUTHORIZED"
    });
  }
};
