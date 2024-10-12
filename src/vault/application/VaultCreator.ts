import { logger } from '../../shared/infrastructure/logger/Logger.js'
import { Vault } from '../domain/Vault.js'
import { type VaultRepository } from '../domain/repositories/VaultRepository.js'
import { v4 as uuid } from 'uuid'
import { VaultCreationException } from './exceptions/VaultCreationException.js'

export class VaultCreator {
  constructor (
    private readonly vaultRepository: VaultRepository
  ) {}

  async run (ownerId: string, vaultName: string): Promise<Vault> {
    try {
      const vault = new Vault(uuid(), vaultName, ownerId)
      return await this.vaultRepository.saveVault(vault)
    } catch (error) {
      logger.error({ name: 'vault-creator' }, `Error creating Vault for new user ${ownerId}`, error)
      throw new VaultCreationException(ownerId, error as Error)
    }
  }
}
