export class IllegalArgException extends Error {
  private readonly _message: string
  constructor (message: string) {
    super(`Illegal argument exception: ${message}`)
    this._message = message
  }

  get getMessage () {
    return this._message
  }
}
