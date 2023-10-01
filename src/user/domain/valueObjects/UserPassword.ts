export class UserPassword {
  private readonly value: string

  constructor (id: string) {
    this.value = id
  }

  get getValue (): string {
    return this.value
  }
}
