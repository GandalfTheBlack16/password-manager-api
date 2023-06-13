import express from 'express'
import dotenv from 'dotenv'
import { HealthCheck } from './controllers/health.js'

dotenv.config()

const port = process.env.PORT ?? 3000

const app = express()

app.get('/health', HealthCheck)

app.listen(port, () => {
  console.log(`Application running on port ${port}`)
})
