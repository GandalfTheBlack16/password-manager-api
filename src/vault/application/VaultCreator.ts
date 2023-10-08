import { Vault } from '../domain/Vault.js'
import { type VaultRepository } from '../domain/repositories/VaultRepository.js'
import { v4 as uuid } from 'uuid'

export class VaultCreator {
  constructor (
    private readonly vaultRepository: VaultRepository
  ) {}

  async run (owner: string): Promise<Vault> {
    const vault = new Vault(uuid(), owner)
    return await this.vaultRepository.saveVault(vault)
  }
}
