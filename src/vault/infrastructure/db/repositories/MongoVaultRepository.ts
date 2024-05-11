import { Credential } from '../../../domain/Credential.js'
import { Vault } from '../../../domain/Vault.js'
import { type VaultRepository } from '../../../domain/repositories/VaultRepository.js'
import { VaultModel } from '../models/VaultModel.js'

interface CredentialModel {
  _id: string
  name: string
  secret: string
  description?: string | undefined
}

export class MongoVaultRepository implements VaultRepository {
  async findVaultById (id: string) {
    const vaultModel = await VaultModel.findById(id)
    if (!vaultModel) {
      return undefined
    }
    const { _id: vaultId, owner, name, credentials, lastModified } = vaultModel
    const vault = new Vault(vaultId, owner, name, lastModified)
    vault.addCredentials(this.credentialsModelToDomain(credentials))
    return vault
  }

  async findVaultsByOwner (owenerId: string) {
    const vaultModel = await VaultModel.find({ owner: owenerId })
    if (!vaultModel) {
      return []
    }
    return vaultModel.map(item => {
      const { _id: id, owner, name, credentials, lastModified } = item
      const vault = new Vault(id, owner, name, lastModified)
      vault.addCredentials(this.credentialsModelToDomain(credentials))
      return vault
    })
  }

  async saveVault (vault: Vault) {
    const vaultModel = await VaultModel.findOneAndUpdate(
      { _id: vault.getId },
      this.vaultDomainToModel(vault),
      { upsert: true, new: true })
    if (!vaultModel) {
      return vault
    }
    const { _id, owner, name, credentials, lastModified } = vaultModel
    const newVault = new Vault(_id, owner, name, lastModified)
    newVault.addCredentials(this.credentialsModelToDomain(credentials))
    return newVault
  }

  async deleteVaultById (id: string) {
    return await VaultModel.deleteOne({ _id: id }) !== undefined
  }

  private credentialsModelToDomain (credentialList: CredentialModel[]): Credential[] {
    return credentialList.map(credential => {
      const { _id: id, name, secret, description } = credential
      return new Credential(id, name, secret, description)
    })
  }

  private vaultDomainToModel (vault: Vault) {
    const { getId: _id, getCredentials, getOwner: owner, getLastModified: lastModified } = vault
    return new VaultModel({
      _id,
      owner,
      credentials: getCredentials.map(credential => {
        return { _id: credential.getId, name: credential.getName, secret: credential.getSecret, description: credential.getDescription }
      }),
      lastModified
    })
  }
}
