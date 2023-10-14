export class VaultNotExistsException extends Error {
  constructor (
    public vaultId: string
  ) {
    super(`VaultNotExistsException vaultId ${vaultId}`)
  }
}
