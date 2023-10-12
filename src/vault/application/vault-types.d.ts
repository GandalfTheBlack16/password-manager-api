import { type Credential } from '../domain/Vault.ts'

export interface VaultUpdaterDto {
  vaultId: string
  credentials: Credential[]
}
