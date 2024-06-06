import { IllegalArgException } from '../../../shared/domain/exception/IllegalArgException.js'
import { Email } from '../../domain/Email.js'
import { type SendMailOptions } from 'nodemailer'
import { EmailMapperException } from '../exceptions/EmailMapperException.js'

export class EmailMapper {
  private readonly senderEmail: string

  constructor (sender: string) {
    this.senderEmail = sender
  }

  map (recipients: string[], subject: string, content: string): SendMailOptions | undefined {
    try {
      const email = new Email(recipients, subject, content)
      return {
        from: `Admin Password Manager <${this.senderEmail}>`,
        to: email.getRecipients,
        subject: email.getSubject,
        text: !email.isContentHtml ? email.getContent : '',
        html: email.isContentHtml ? email.getContent : ''
      }
    } catch (error) {
      if (error instanceof IllegalArgException) {
        throw new EmailMapperException(`Could not map Email entity. Cause: ${error.message}`)
      }
    }
  }
}
