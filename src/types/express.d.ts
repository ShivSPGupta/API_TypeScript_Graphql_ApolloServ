import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;  // You can replace 'any' with a proper user type if you have one.
}
