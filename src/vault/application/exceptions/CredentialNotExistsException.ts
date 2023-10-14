export class CredentialNotExistsException extends Error {
  constructor (
    vaultId: string,
    credentialId: string
  ) {
    super(`CredentialNotExistsException vaultId ${vaultId} credentialId ${credentialId}`)
  }
}
