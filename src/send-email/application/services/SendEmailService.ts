import { type Transporter } from 'nodemailer'
import { type EmailMapper } from '../mappers/EmailMapper.js'
import { logger } from '../../../shared/infrastructure/logger/Logger.js'

export class SendEmailService {
  constructor (private readonly mapper: EmailMapper) {
    this.mapper = mapper
  }

  async sendEmail (transport: Transporter, recipients: string[], subject: string, content: string) {
    try {
      const payload = this.mapper.map(recipients, subject, content)
      if (!payload) {
        throw new Error('Email could not be sended')
      }
      return await transport.sendMail(payload)
    } catch (error) {
      logger.error({ name: 'send-email-service' }, (error as Error).message)
    }
  }
}
