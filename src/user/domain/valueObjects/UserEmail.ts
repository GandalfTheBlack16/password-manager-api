import { IllegalArgException } from '../../../shared/domain/exception/IllegalArgException.js'
import { validateEmail } from '../../../shared/domain/utils/EmailUtils.js'

export class UserEmail {
  private readonly value: string

  constructor (email: string) {
    this.value = email
    this.validateEmail()
  }

  private validateEmail (): void {
    if (!validateEmail(this.value)) {
      throw new IllegalArgException(`Invalid address provided ${this.value}`)
    }
  }

  public get getValue (): string {
    return this.value
  }
}
