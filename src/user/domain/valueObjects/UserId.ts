import { validate } from 'uuid'
import { IllegalArgException } from '../../../shared/exception/IllegalArgException.js'

export class UserId {
  private readonly value: string

  constructor (id: string) {
    this.value = id
    this.validateId()
  }

  get getValue (): string {
    return this.value
  }

  private validateId (): void {
    if (!validate(this.value)) {
      throw new IllegalArgException('Invalid UUID provided')
    }
  }
}
