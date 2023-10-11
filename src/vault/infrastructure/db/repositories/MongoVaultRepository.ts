import { Vault } from '../../../domain/Vault.js'
import { type VaultRepository } from '../../../domain/repositories/VaultRepository.js'
import { VaultModel } from '../models/VaultModel.js'

export class MongoVaultRepository implements VaultRepository {
  async findVaultById (id: string) {
    const vaultModel = await VaultModel.findById(id)
    if (!vaultModel) {
      return undefined
    }
    const { _id: vaultId, owner, credentials } = vaultModel
    const vault = new Vault(vaultId, owner)
    vault.addCredentials(credentials)
    return vault
  }

  async findVaultsByOwner (owner: string) {
    const vaultModel = await VaultModel.find({ owner })
    if (!vaultModel) {
      return []
    }
    return vaultModel.map(item => {
      const { _id: id, owner, credentials } = item
      const vault = new Vault(id, owner)
      vault.addCredentials(credentials)
      return vault
    })
  }

  async saveVault (vault: Vault) {
    const vaultModel = await VaultModel.findOneAndUpdate({ _id: vault.getId }, vault, { upsert: true, new: true })
    if (!vaultModel) {
      return vault
    }
    const { _id, owner, credentials } = vaultModel
    const newVault = new Vault(_id, owner)
    newVault.addCredentials(credentials)
    return newVault
  }

  async deleteVaultById (id: string) {
    return await VaultModel.deleteOne({ _id: id }) !== undefined
  }
}
