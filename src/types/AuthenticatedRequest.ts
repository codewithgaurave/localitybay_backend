import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    id: string;
    email: string;
    name: string;
    role: string;
  };
}