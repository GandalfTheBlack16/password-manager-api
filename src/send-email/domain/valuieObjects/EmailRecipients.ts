import { IllegalArgException } from '../../../shared/domain/exception/IllegalArgException.js'
import { logger } from '../../../shared/infrastructure/logger/Logger.js'

export class EmailRecipients {
  private readonly value: string[]
  private readonly regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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

  private validateAddress (address: string): boolean {
    return this.regex.test(address.toLowerCase())
  }
}
