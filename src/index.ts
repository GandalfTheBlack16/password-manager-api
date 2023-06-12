import express from 'express'
import dotenv from 'dotenv'
import { HealthCheck } from './controllers/health.js'

dotenv.config()

const app = express()

app.get('/health', HealthCheck)

app.listen(process.env.SERVER_PORT, () => {
  const port = process.env.SERVER_PORT ?? ''
  console.log(`Application running on port ${port}`)
})
