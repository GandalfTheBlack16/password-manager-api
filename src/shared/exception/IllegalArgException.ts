export class IllegalArgException extends Error {
  constructor (message: string) {
    super(`Illegal argument exception: ${message}`)
  }
}
