import { logger } from '../../shared/infrastructure/logger/Logger.js'
import { type Vault } from '../domain/Vault.js'
import { type VaultRepository } from '../domain/repositories/VaultRepository.js'
import { VaultFinderException } from './exeptions/VaultFinderException.js'

export class VaultFinder {
  constructor (
    private readonly vaultRepository: VaultRepository
  ) {}

  async run (ownerId: string): Promise<Vault[]> {
    try {
      return await this.vaultRepository.findVaultsByOwner(ownerId)
    } catch (error) {
      logger.error({ name: 'vault-service' }, `Error fetching vaults for user ${ownerId}`)
      throw new VaultFinderException(ownerId, error as Error)
    }
  }
}
