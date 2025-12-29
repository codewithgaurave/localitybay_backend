import { Request } from 'express';

// Properly extend Express Request to include all properties
export interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    id: string;
    email: string;
    name: string;
    role: string;
  };
  // Explicitly include Express Request properties for TypeScript
  body: any;
  params: any;
  query: any;
  headers: any;
}