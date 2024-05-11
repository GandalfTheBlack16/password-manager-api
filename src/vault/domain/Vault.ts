import { VaultId } from './valueObjects/VaultId.js'
import { type Credential } from './Credential.js'
import { CredentialIdMismathchingException } from './exceptions/CredentialIdMismatchingException.js'

export class Vault {
  private readonly id: VaultId
  private readonly owner: string
  private name: string
  private lastModified: Date
  private credentials: Credential[]

  constructor (
    id: string,
    owner: string,
    vaultName?: string,
    lastModified?: Date
  ) {
    this.id = new VaultId(id)
    this.owner = owner
    this.name = vaultName ?? 'Private Vault'
    this.lastModified = lastModified ?? new Date()
    this.credentials = []
  }

  get getId (): string {
    return this.id.getValue
  }

  get getOwner (): string {
    return this.owner
  }

  get getName (): string {
    return this.name
  }

  get getCredentials (): Credential[] {
    return this.credentials
  }

  get getLastModified (): Date {
    return this.lastModified
  }

  updateName (vaultName: string): void {
    this.name = vaultName
  }

  updateLastModified (): void {
    this.lastModified = new Date()
  }

  addCredential (credential: Credential) {
    const index = this.credentials.findIndex(item => item.getId === credential.getId)
    if (index >= 0) {
      this.updateCredentialById(index, credential)
      return
    }
    this.credentials.push(credential)
  }

  addCredentials (credentials: Credential[]) {
    credentials.forEach(credential => { this.addCredential(credential) })
  }

  getCredentialById (credentialId: string) {
    return this.credentials.find(i => i.getId === credentialId)
  }

  deleteCredentialById (credentialId: string) {
    this.credentials = this.credentials.filter(credential => credential.getId !== credentialId)
  }

  private updateCredentialById (index: number, credential: Credential) {
    if (this.credentials[index].getId !== credential.getId) {
      throw new CredentialIdMismathchingException(credential.getId, this.credentials[index].getId)
    }
    this.credentials[index] = credential
  }
}
