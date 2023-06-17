import express from 'express'
import dotenv from 'dotenv'
import { HealthCheck } from './health.js'
import { logger } from './shared/infrastructure/logger/Logger.js'
import { pinoHttp } from 'pino-http'
import { MongoConnection } from './user/infrastructure/db/MongoConnection.js'
import { userRouter } from './user/infrastructure/http/UserRouter.js'

dotenv.config()

const port = process.env.PORT ?? 3000

const app = express()

const db = new MongoConnection()

app.use(express.json())

app.use(pinoHttp({ logger, level: 'error' }))

app.get('/health', (req, res) => {
  HealthCheck(res, db)
})

app.use('/api/user', userRouter)

app.listen(port, async () => {
  logger.info({ name: 'password-manager' }, `Application running on port ${port}`)
  try {
    await db.connect()
    logger.info({ name: 'password-manager' }, `Connected to database ${db.getDataBaseInfo()}`)
  } catch (error) {
    logger.error({ name: 'password-manager' }, `Error connecting to database: ${error as string}`)
  }
})
