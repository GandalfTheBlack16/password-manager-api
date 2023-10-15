export interface CredentialDto {
  id?: string
  name: string
  secret: string
  description?: string
}

export interface VaultUpdaterDto {
  vaultId: string
  credentials: CredentialDto[]
}

export interface VaultCredentialEraserDto {
  vaultId: string
  credentialId: string
}

export interface VaultEraserDto {
  vaultId?: string
  userId?: string
}
