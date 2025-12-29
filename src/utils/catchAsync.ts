import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async function to catch errors and pass them to the error handling middleware
 * @param fn - The async function to wrap
 * @returns Express middleware function
 */
const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync; 