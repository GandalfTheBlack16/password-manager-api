export class UserDoesNotExistsException extends Error {
  constructor (
    public userId: string
  ) {
    super(`User with id ${userId} does not exists`)
  }
}
