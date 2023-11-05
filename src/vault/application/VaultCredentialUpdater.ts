import { encryptData } from '../../shared/application/crypto/CryptoUtils.js'
import { logger } from '../../shared/infrastructure/logger/Logger.js'
import { Credential } from '../domain/Credential.js'
import { type VaultRepository } from '../domain/repositories/VaultRepository.js'
import { type VaultUpdaterDto } from './vault-types.js'
import { v4 as uuid } from 'uuid'

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
      const credId = credential.id ?? uuid()
      return new Credential(credId, credential.name, encryptData(credential.secret), credential.description)
    }))
    vault.updateLastModified()
    return await this.vaultRepository.saveVault(vault)
  }
}
