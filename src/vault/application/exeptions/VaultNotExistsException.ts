export class VaultNotExistsException extends Error {
  constructor (
    vaultId: string
  ) {
    super(`VaultNotExistsException vaultId ${vaultId}`)
  }
}
