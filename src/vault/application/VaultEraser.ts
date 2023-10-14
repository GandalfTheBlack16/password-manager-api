import { type VaultRepository } from '../domain/repositories/VaultRepository.js'
import { VaultNotExistsException } from './exeptions/VaultNotExistsException.js'

export class VaultEraser {
  constructor (
    private readonly vaultRepository: VaultRepository
  ) {}

  async run (vaultId: string) {
    if (!await this.vaultRepository.deleteVaultById(vaultId)) {
      throw new VaultNotExistsException(vaultId)
    }
  }
}
