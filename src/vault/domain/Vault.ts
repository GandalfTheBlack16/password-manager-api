import { VaultId } from './valueObjects/VaultId.js'

export interface Credential {
  name?: string
  serviceName: string
  secret: string
}

export class Vault {
  private readonly id: VaultId
  private readonly owner: string
  private credentials: Credential[]

  constructor (
    id: string,
    owner: string
  ) {
    this.id = new VaultId(id)
    this.owner = owner
    this.credentials = []
  }

  get getId (): string {
    return this.id.getValue
  }

  get getOwner (): string {
    return this.owner
  }

  get getCredentials (): Credential[] {
    return this.credentials
  }

  addCredential (credential: Credential) {
    if (!credential.name) {
      credential.name = credential.serviceName
    }
    this.credentials.push(credential)
  }

  addCredentials (credentials: Credential[]) {
    credentials.forEach(credential => { this.addCredential(credential) })
  }

  deleteCredentialByName (credentialName: string) {
    this.credentials = this.credentials.filter(credential => credential.name !== credentialName)
  }

  updateCredentialByName (credentialName: string, credential: Credential) {
    if (!credential.name) {
      credential.name = credentialName
    }
    this.credentials = this.credentials.map(item => item.name === credentialName ? { ...credential } : item)
  }
}
