import { IllegalArgException } from '../../../shared/domain/exception/IllegalArgException.js'

export class UserPassword {
  private readonly value: string
  private readonly regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/

  constructor (id: string) {
    this.value = id
    this.validatePassword()
  }

  get getValue (): string {
    return this.value
  }

  private validatePassword (): void {
    if (!this.regex.test(this.value)) {
      throw new IllegalArgException('Invalid password provided')
    }
  }
}
