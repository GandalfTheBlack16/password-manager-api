import { type Response } from 'express'
import { type MongoConnection } from './shared/infrastructure/db/MongoConnection.js'

export function HealthCheck (res: Response, db: MongoConnection) {
  res.json({
    application: 'UP',
    database: db.getDataBaseInfo() ? 'UP' : 'DOWN'
  })
}
