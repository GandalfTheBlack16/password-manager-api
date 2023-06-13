import express from 'express'
import dotenv from 'dotenv'
import { HealthCheck } from './health.js'
import { logger } from './shared/logger/Logger.js'
import { pinoHttp } from 'pino-http'

dotenv.config()

const port = process.env.PORT ?? 3000

const app = express()

app.use(pinoHttp({ logger, level: 'error' }))

app.get('/health', HealthCheck)

app.listen(port, () => {
  logger.info({ name: 'password-manager' }, `Application running on port ${port}`)
})
