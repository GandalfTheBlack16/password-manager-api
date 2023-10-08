import { type Vault } from '../Vault.js'

export interface VaultRepository {
  findVaultById: (id: string) => Promise<Vault | undefined>
  findVaultsByOwner: (owner: string) => Promise<Vault[]>
  saveVault: (vault: Vault) => Promise<Vault>
  deleteVaultById: (id: string) => Promise<boolean>
}
