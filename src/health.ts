import { type Request, type Response } from 'express'

export function HealthCheck (req: Request, res: Response) {
  const port = Number(req.headers.host?.split(':')[1]) ?? 'UNKNOWN'
  res.json({
    status: 'UP',
    port
  })
}
