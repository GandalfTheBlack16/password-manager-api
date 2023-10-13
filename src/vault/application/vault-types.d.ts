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
