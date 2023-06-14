export class UserAlreadyExistsException extends Error {
  constructor (message: string) {
    super(`User already exists: ${message}`)
  }
}
