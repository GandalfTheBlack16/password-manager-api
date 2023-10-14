
export class VaultCreationException extends Error {
  constructor (private readonly owner: string, cause: Error) {
    super(`VaultCreationException for user ${owner}: ${cause.message}`)
  }

  get getOwner () {
    return this.owner
  }
}
