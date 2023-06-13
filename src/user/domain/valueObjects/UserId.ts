import { validate } from 'uuid'
import { IllegalArgsException } from '../../shared/exception/IllegalArgsException.js'

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
      throw new IllegalArgsException('Invalid UUID provided')
    }
  }
}
