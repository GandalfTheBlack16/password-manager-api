import express from 'express'
import { HealthCheck } from './controllers/health.js'

const app = express()

app.get('/health', HealthCheck)

if (import.meta.env.PROD) {
  app.listen(import.meta.env.SERVER_PORT, () => {
    console.log(`Application running on port ${import.meta.env.SERVER_PORT}`)
  })
}

export const viteNodeApp = app
