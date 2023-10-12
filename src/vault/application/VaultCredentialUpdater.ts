import { encryptData } from '../../shared/application/crypto/CryptoUtils.js'
import { logger } from '../../shared/infrastructure/logger/Logger.js'
import { type VaultRepository } from '../domain/repositories/VaultRepository.js'
import { type VaultUpdaterDto } from './vault-types.js'

export class VaultCredentialUpdater {
  constructor (
    private readonly vaultRepository: VaultRepository
  ) {}

  async run ({ vaultId, credentials }: VaultUpdaterDto) {
    const vault = await this.vaultRepository.findVaultById(vaultId)
    if (!vault) {
      logger.error({ name: 'vault-service' }, `Vault does not exists '${vaultId}'`)
      return null
    }
    vault.addCredentials(credentials.map(credential => {
      return {
        ...credential,
        secret: encryptData(credential.secret)
      }
    }))
    return await this.vaultRepository.saveVault(vault)
  }
}
