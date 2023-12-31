import { type VaultRepository } from '../domain/repositories/VaultRepository.js'
import { CredentialNotExistsException } from './exceptions/CredentialNotExistsException.js'
import { VaultNotExistsException } from './exceptions/VaultNotExistsException.js'
import { type VaultCredentialEraserDto } from './vault-types.js'

export class VaultCredentialEraser {
  constructor (
    private readonly vaultRepository: VaultRepository
  ) {}

  async run ({ vaultId, credentialId }: VaultCredentialEraserDto) {
    const vault = await this.vaultRepository.findVaultById(vaultId)
    if (!vault) {
      throw new VaultNotExistsException(vaultId)
    }
    if (!vault.getCredentialById(credentialId)) {
      throw new CredentialNotExistsException(vaultId, credentialId)
    }
    vault.deleteCredentialById(credentialId)
    vault.updateLastModified()
    return await this.vaultRepository.saveVault(vault)
  }
}
