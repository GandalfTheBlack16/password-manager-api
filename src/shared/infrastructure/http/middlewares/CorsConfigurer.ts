import { type Request, type Response, type NextFunction } from 'express'

interface CorsOptions {
  allowedOrigins: string
  allowedMethods: string
  allowedHeaders: string
  allowCredentials: string
}

export const corsConfig = (req: Request, res: Response, next: NextFunction) => {
  const config: CorsOptions = {
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS ?? 'http://localhost:5173',
    allowedMethods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Access-Control-Allow-Headers,Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization',
    allowCredentials: 'true'
  }

  res.set('Access-Control-Allow-Origin', config.allowedOrigins)
  res.set('Access-Control-Allow-Methods', config.allowedMethods)
  res.set('Access-Control-Allow-Headers', config.allowedHeaders)
  res.set('Access-Control-Allow-Credentials', config.allowCredentials)
  next()
}

export const preflightOptions = (req: Request, res: Response) => {
  res.sendStatus(200)
}
