import { decryptData } from '../../shared/application/crypto/CryptoUtils.js'
import { logger } from '../../shared/infrastructure/logger/Logger.js'
import { type Vault } from '../domain/Vault.js'
import { Credential } from '../domain/Credential.js'
import { type VaultRepository } from '../domain/repositories/VaultRepository.js'
import { VaultFinderException } from './exceptions/VaultFinderException.js'

export class VaultFinder {
  constructor (
    private readonly vaultRepository: VaultRepository
  ) {}

  async run (ownerId: string, vaultName: string | undefined): Promise<Vault[]> {
    try {
      return (await this.vaultRepository
        .findVaultsByOwner(ownerId)
      )
        .filter(vault => vaultName ? vault.getName.toLowerCase() === vaultName?.toLowerCase() : true)
        .map(vault => {
          const { getCredentials } = vault
          const decryptedCredentials = getCredentials.map(credential => {
            const { getId: id, getName: name, getDescription: description, getSecret: secret } = credential
            return new Credential(id, name, decryptData(secret), description)
          })
          vault.addCredentials(decryptedCredentials)
          return vault
        })
    } catch (error) {
      logger.error({ name: 'vault-service' }, `Error fetching vaults for user ${ownerId}: ${(error as Error).message}`)
      throw new VaultFinderException(ownerId, error as Error)
    }
  }
}
