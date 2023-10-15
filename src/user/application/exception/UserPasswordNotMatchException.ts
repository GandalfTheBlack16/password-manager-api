export class UserPasswordNotMatchException extends Error {
  constructor (
    userId: string
  ) {
    super(`Password does not match for user ${userId}`)
  }
}
