import express from 'express'
import { HealthCheck } from './controllers/health.js'

const app = express()

app.get('/health', HealthCheck)

if (import.meta.env.PROD) { app.listen(3000) }

export const viteNodeApp = app
