import { EmailContent } from './valuieObjects/EmailContent.js'
import { EmailRecipients } from './valuieObjects/EmailRecipients.js'

export class Email {
  private readonly recipients: EmailRecipients
  private readonly subject: string
  private readonly content: EmailContent

  constructor (recipients: string[], subject: string, content: string) {
    this.recipients = new EmailRecipients(recipients)
    this.subject = subject
    this.content = new EmailContent(content)
  }

  get getRecipients (): string[] {
    return this.recipients.getValue
  }

  get getSubject (): string {
    return this.subject
  }

  get getContent (): string {
    return this.content.getValue
  }

  get isContentHtml (): boolean {
    return this.content.getIsHtml
  }
}
