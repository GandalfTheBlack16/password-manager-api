import { logger } from '../../shared/infrastructure/logger/Logger.js'
import { EmailMapper } from '../application/mappers/EmailMapper.js'
import { SendEmailService } from '../application/services/SendEmailService.js'
import { GmailAuthException } from './exception/GmailAuthException.js'
import { gmailTransport } from './transports/GmailTransport.js'

const senderEmailAddress = process.env.GOOGLE_ACCOUNT_EMAIL ?? ''

const emailMapper = new EmailMapper(senderEmailAddress)
const emailService = new SendEmailService(emailMapper)

export const sendEmail = async (recipients: string[], subject: string, content: string) => {
  let transport
  try {
    transport = await gmailTransport()
    if (!transport) {
      throw Error('Undefined transporter')
    }
    const { accepted, rejected } = await emailService.sendEmail(transport, recipients, subject, content)
    logger.info({ name: 'send-email' }, `Email sended succesfully to ${(accepted as string[]).join(', ')}`)
    if ((rejected as string[]).length > 0) {
      logger.warn({ name: 'send-email' }, `Email could not be sent to ${(rejected as string[]).join(', ')}`)
    }
  } catch (error) {
    if (error instanceof GmailAuthException) {
      logger.error({ name: 'send-email' }, error.message)
    }
  }
}
