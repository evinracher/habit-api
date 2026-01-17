import type { NextFunction, Request, Response } from 'express'
import env from '../../env.ts'

interface APIError extends Error {
  status: number
} // You can also create a new class APIError and throw new APIError

// Just an example of how you could od it
export const errorHandler = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err.stack) // It is ok in dev env
  let status = err.status || 500
  let message = err.message || 'Internal Server Error'
  if (err.name === 'ValidationError') {
    status = 400
    message = 'Validation Error'
  }

  if (err.name === 'UnauthorizedError') {
    status = 401
    message = 'Unauthorized'
  }

  return res.status(status).json({
    error: message,
    ...(env.APP_STAGE === 'dev' && { // more details if we are in dev
      stack: err.stack,
      details: err.message,
    }),
  })
}
