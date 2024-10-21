import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/express';

// export interface AuthenticatedRequest extends Request {
//     user?: string | JwtPayload;
//   }
  

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });

    // Store the decoded user info in the request object
    req.user = decoded as { id: string; email: string }; 
    next(); // Proceed to the next middleware or route handler
  });
};
