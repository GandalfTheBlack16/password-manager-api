import { VaultFinder } from '../../../src/vault/application/VaultFinder.js'
import { Vault } from '../../../src/vault/domain/Vault.js'
import { VaultId } from '../../../src/vault/domain/valueObjects/VaultId.js'
import { VaultRepositoryStub } from './resources/vaultRepositoryStub.js'
import { v4 as UUID } from 'uuid'

describe('Vault finder use-case', () => {
  let vaultFinder: VaultFinder 
  let vaultRepository: VaultRepositoryStub

  beforeEach(() => {
    vaultRepository = new VaultRepositoryStub()
    vaultFinder = new VaultFinder(vaultRepository)
  })

  it('should get empty list of vaults', async () => {
    const vaultList = await vaultFinder.run('userId')
    expect(vaultList.length).toBe(0)
  })

  it('should get vault from user',async () => {
    const userId = UUID()
    const vault = new Vault(userId, 'user')
    vault.addCredentials([
        { name: 'password-manager', serviceName: 'pasword-manager', secret: 'secretPassword' },
        { name: 'google', serviceName: 'google.com', secret: 'secretPassword' },
        { name: 'facebook', serviceName: 'facebook.com', secret: 'secretPassword' },
    ])
    vaultRepository.mockedVaultList = [ vault ]
    const vaultList = await vaultFinder.run(userId)
    expect(vaultList.length).toBe(1)
    expect(vaultList[0].getId).toBe(userId)
    expect(vaultList[0].getOwner).toBe('user')
    expect(vaultList[0].getCredentials.length).toBe(3)
  })
})
