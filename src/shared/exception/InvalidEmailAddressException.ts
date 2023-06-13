export class InvalidEmailAddressException extends Error {
  constructor (message: string) {
    super(`Invalid Email address exception: ${message}`)
  }
}
