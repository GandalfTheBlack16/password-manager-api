import { type NextFunction, type Request, type Response } from 'express'

export interface IExpressController {
  handleRequest: (req: Request, res: Response, next?: NextFunction) => Promise<Response<any, Record<string, any>>>
}
