import { IllegalArgException } from '../../../shared/domain/exception/IllegalArgException.js'
import { validateEmail } from '../../../shared/domain/utils/EmailUtils.js'
import { logger } from '../../../shared/infrastructure/logger/Logger.js'

export class EmailRecipients {
  private readonly value: string[]

  constructor (value: string[]) {
    this.value = []
    value.forEach(address => {
      if (!this.validateAddress(address)) {
        logger.warn(`Invalid email address "${address}"`)
      } else {
        this.value.push(address)
      }
    })
    if (this.value.length === 0) {
      throw new IllegalArgException('None valid address')
    }
  }

  get getValue (): string[] {
    return this.value
  }

  private validateAddress (address: string) {
    return validateEmail(address)
  }
}
