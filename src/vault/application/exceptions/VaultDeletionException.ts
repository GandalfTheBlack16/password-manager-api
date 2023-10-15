export class VaultDeletionException extends Error {
  constructor (
    userId: string,
    error: Error
  ) {
    super(`Could not delete vaults for user ${userId}: ${error.message}`)
  }
}
