export class VaultFinderException extends Error {
  constructor (
    private readonly owner: string,
    cause: Error
  ) {
    super(`VaultFinderException userId: ${owner}: ${cause.message}`)
  }

  get getOwner () {
    return this.owner
  }
}
