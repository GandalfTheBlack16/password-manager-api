import { type Vault } from '../../../../src/vault/domain/Vault.js'
import { type VaultRepository } from '../../../../src/vault/domain/repositories/VaultRepository.js'

export class VaultRepositoryStub implements VaultRepository {
  mockedVaultList: Vault[]

  constructor () {
    this.mockedVaultList = []
  }

  async findVaultById (id: string): Promise<Vault | undefined> {
    return await Promise.resolve(this.mockedVaultList.find(i => i.getId === id))
  }

  async findVaultsByOwner (owner: string): Promise<Vault[]> {
    return await Promise.resolve(this.mockedVaultList.filter(i => i.getOwner === owner))
  }

  async saveVault (vault: Vault): Promise<Vault> {
    this.mockedVaultList.push(vault)
    return await Promise.resolve(vault)
  }

  async deleteVaultById (id: string): Promise<boolean> {
    const prevLength = this.mockedVaultList.length
    this.mockedVaultList = this.mockedVaultList.filter(i => i.getId !== id)
    return await Promise.resolve(this.mockedVaultList.length === prevLength - 1)
  }
}
