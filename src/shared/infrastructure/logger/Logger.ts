import { pino } from 'pino'

const level = process.env.loglevel ?? 'info'

export const logger = pino({
  level,
  transport: {
    target: 'pino-pretty'
  }
})
