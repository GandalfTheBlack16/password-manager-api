import { logger } from '../../shared/infrastructure/logger/Logger.js'
import { type VaultRepository } from '../domain/repositories/VaultRepository.js'
import { VaultDeletionException } from './exceptions/VaultDeletionException.js'
import { VaultNotExistsException } from './exceptions/VaultNotExistsException.js'
import { type VaultEraserDto } from './vault-types.js'

export class VaultEraser {
  constructor (
    private readonly vaultRepository: VaultRepository
  ) {}

  async run ({ vaultId, userId }: VaultEraserDto) {
    if (vaultId) {
      logger.info({ name: 'vault-eraser' }, `Deleting vault with id ${vaultId}`)
      if (!await this.vaultRepository.deleteVaultById(vaultId)) {
        throw new VaultNotExistsException(vaultId)
      }
    } else if (userId) {
      logger.info({ name: 'vault-eraser' }, `Deleting all vaults for user ${userId}`)
      const vaultList = await this.vaultRepository.findVaultsByOwner(userId)
      vaultList.forEach((vault) => {
        this.vaultRepository
          .deleteVaultById(vault.getId)
          .then(succes => {
            if (!succes) {
              logger.error({ name: 'vault-eraser' }, `Vault ${vault.getId} owned by user ${userId} cannot be removed. Manual deletion should be required`)
            }
          }).catch(error => {
            logger.error({ name: 'vault-eraser' }, `Error deleting vaults of user ${userId}`)
            throw new VaultDeletionException(userId, error)
          })
      })
    }
  }
}
