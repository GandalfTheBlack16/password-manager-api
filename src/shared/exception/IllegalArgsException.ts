export class IllegalArgsException extends Error {
  constructor (message: string) {
    super(`Illegal argument exception: ${message}`)
  }
}
