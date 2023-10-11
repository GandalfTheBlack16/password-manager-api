import { logger } from '../../shared/infrastructure/logger/Logger.js'
import { Vault } from '../domain/Vault.js'
import { type VaultRepository } from '../domain/repositories/VaultRepository.js'
import { v4 as uuid } from 'uuid'
import { VaultCreationException } from './exeptions/VaultCreationException.js'

export class VaultCreator {
  constructor (
    private readonly vaultRepository: VaultRepository
  ) {}

  async run (owner: string): Promise<Vault> {
    try {
      const vault = new Vault(uuid(), owner)
      return await this.vaultRepository.saveVault(vault)
    } catch (error) {
      logger.error({ name: 'vault-creator' }, `Error creating Vault for new user ${owner}`, error)
      throw new VaultCreationException(owner, error as Error)
    }
  }
}
