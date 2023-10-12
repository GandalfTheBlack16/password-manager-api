import { v4 } from 'uuid'
import { VaultCredentialUpdater } from '../../../src/vault/application/VaultCredentialUpdater.js'
import { Credential, Vault } from '../../../src/vault/domain/Vault.js'
import { VaultRepositoryStub } from '../application/resources/vaultRepositoryStub.js'

describe('Credential update use-case', () => {
    let vaultCredentialUpdater: VaultCredentialUpdater
    let vaultRepository: VaultRepositoryStub

    beforeEach(() => {
        vaultRepository = new VaultRepositoryStub()
        vaultCredentialUpdater = new VaultCredentialUpdater(vaultRepository)
    })

    it('should return null if vault does not exist', async () => {
        jest.spyOn(vaultRepository, 'findVaultById').mockResolvedValue(undefined)
        const vault = await vaultCredentialUpdater.run({ vaultId: 'fakeId', credentials: []})
        expect(vaultRepository.findVaultById).toBeCalledWith('fakeId')
        expect(vault).toBeNull()
    })

    it('should add new credentials to vault', async () => {
        const credentials: Credential[] = [
            { name: 'test', serviceName: 'test-service', secret: 'testSecret' }
        ]
        const vaultId = v4()
        vaultRepository.mockedVaultList.push(new Vault(vaultId, 'owner'))
        jest.spyOn(vaultRepository, 'saveVault')
        const vault = await vaultCredentialUpdater.run({ vaultId, credentials })
        expect(vaultRepository.saveVault).toHaveBeenCalled()
        expect(vault).toBeDefined()
        expect(vault?.getCredentials.length).toBe(1)
        expect(vault?.getCredentials[0]).toStrictEqual(credentials[0])
    })

    it('should create or update if credential exists', async () => {
        const credentials: Credential[] = [
            { name: 'test', serviceName: 'test-service', secret: 'testSecret' }
        ]
        const vaultId = v4()
        const mockVault = new Vault(vaultId, 'owner')
        mockVault.addCredentials(credentials)
        vaultRepository.mockedVaultList.push(mockVault)
        jest.spyOn(vaultRepository, 'saveVault')
        const vault = await vaultCredentialUpdater.run({
            vaultId,
            credentials: [
                { name: 'newCredential', serviceName: 'newCredential-service', secret: 'lasjfakf91512hrnfka' },
                { name: 'test', serviceName: 'test-service', secret: 'updatedTestSecret' }
            ]
        })
        expect(vaultRepository.saveVault).toHaveBeenCalledTimes(1)
        expect(vault).toBeDefined()
        expect(vault?.getCredentials.length).toBe(2)
        expect(vault?.getCredentials.find(i => i.name === 'test')?.secret).toBe('updatedTestSecret')
    })
})