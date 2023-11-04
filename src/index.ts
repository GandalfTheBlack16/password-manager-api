import express, { type Request, type Response } from 'express'
import dotenv from 'dotenv'
import { HealthCheck } from './health.js'
import { logger } from './shared/infrastructure/logger/Logger.js'
import { pinoHttp } from 'pino-http'
import { MongoConnection } from './shared/infrastructure/db/MongoConnection.js'
import { userRouter } from './user/infrastructure/http/UserRouter.js'
import { authRouter } from './user/infrastructure/http/AuthRouter.js'
import { jtwAthentication } from './user/infrastructure/http/middlewares/JwtAuthentication.js'
import { vaultRouter } from './vault/infrastructure/http/vaultRouter.js'
import { corsConfig, preflightOptions } from './shared/infrastructure/http/middlewares/CorsConfigurer.js'

dotenv.config()

const port = process.env.PORT ?? 3000

const app = express()

const db = new MongoConnection()

app.use(express.json())

app.use(corsConfig)

app.use(pinoHttp({ logger, level: 'error' }))

app.options('/*', preflightOptions)

app.use('/', authRouter)

app.use('/api/users', jtwAthentication, userRouter)

app.use('/api/vaults', jtwAthentication, vaultRouter)

app.get('/health', (req, res) => { HealthCheck(res, db) })

app.use((req: Request, res: Response) => { res.status(404).json({ status: 'Error', message: `Cannot ${req.method} ${req.url}` }) })

app.listen(port, async () => {
  logger.info({ name: 'password-manager' }, `Application running on port ${port}`)
  try {
    await db.connect()
    logger.info({ name: 'password-manager' }, `Connected to database ${db.getDataBaseInfo()}`)
  } catch (error) {
    logger.error({ name: 'password-manager' }, `Error connecting to database: ${error as string}`)
  }
})
