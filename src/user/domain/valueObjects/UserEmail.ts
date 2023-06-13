import { InvalidEmailAddressException } from '../../../shared/exception/InvalidEmailAddressException.js'

export class UserEmail {
  private readonly value: string
  private readonly regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  constructor (email: string) {
    this.value = email
    this.validateEmail()
  }

  private validateEmail (): void {
    if (!this.regex.test(this.value.toLowerCase())) {
      throw new InvalidEmailAddressException(`Invalid address provided ${this.value}`)
    }
  }

  public get getValue (): string {
    return this.value
  }
}
