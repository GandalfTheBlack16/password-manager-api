import { VaultCreator } from '../../../src/vault/application/VaultCreator.js'
import { VaultRepositoryStub } from './resources/vaultRepositoryStub.js'

describe('Vault creation use-case', () => {
  let vaultCreator: VaultCreator
  let vaultRepository: VaultRepositoryStub

  beforeEach(() => {
    vaultRepository = new VaultRepositoryStub()
    vaultCreator = new VaultCreator(vaultRepository)
  })

  it('should create a new vault', async () => {
    await vaultCreator.run('username')
    expect(vaultRepository.mockedVaultList.length).toBe(1)
    expect(vaultRepository.mockedVaultList.at(0)?.getOwner).toBe('username')
  })

  it('should create multiple vaults', async () => {
    await vaultCreator.run('username')
    await vaultCreator.run('username')
    await vaultCreator.run('username')
    expect(vaultRepository.mockedVaultList.length).toBe(3)
  })
})
