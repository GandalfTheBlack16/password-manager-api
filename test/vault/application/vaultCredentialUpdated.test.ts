import { v4 } from 'uuid';
import { VaultCredentialUpdater } from '../../../src/vault/application/VaultCredentialUpdater.js'
import { Vault } from '../../../src/vault/domain/Vault.js'
import { Credential } from '../../../src/vault/domain/Credential.js'
import { VaultRepositoryStub } from '../application/resources/vaultRepositoryStub.js'
import { encryptData } from '../../../src/shared/application/crypto/CryptoUtils.js'
import { CredentialDto } from '../../../src/vault/application/vault-types.js';

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
        const credentials: CredentialDto[] = [
            { name: 'test', secret: 'secret' }
        ]
        const vaultId = v4()
        vaultRepository.mockedVaultList.push(new Vault(vaultId, 'owner'))
        jest.spyOn(vaultRepository, 'saveVault')
        const vault = await vaultCredentialUpdater.run({ vaultId, credentials })
        expect(vaultRepository.saveVault).toHaveBeenCalled()
        expect(vault).toBeDefined()
        expect(vault?.getCredentials.length).toBe(1)
        expect(vault?.getCredentials[0]).toBeDefined()
        expect(vault?.getCredentials[0].getName).toBe('test')
        expect(vault?.getCredentials[0].getSecret).toBe(encryptData('secret'))
    })

    it('should create or update if credential exists', async () => {
        const credId = v4()
        const credentials: Credential[] = [
            new Credential(credId, 'test', 'testSecret')
        ]
        const vaultId = v4()
        const mockVault = new Vault(vaultId, 'owner')
        mockVault.addCredentials(credentials)
        vaultRepository.mockedVaultList.push(mockVault)
        jest.spyOn(vaultRepository, 'saveVault')
        const vault = await vaultCredentialUpdater.run({
            vaultId,
            credentials: [
                { name: 'newCredential', description: 'newCredential-service', secret: 'lasjfakf91512hrnfka' },
                { id: credId, name: 'test', description: 'test-service', secret: 'updatedTestSecret' }
            ]
        })
        expect(vaultRepository.saveVault).toHaveBeenCalledTimes(1)
        expect(vault).toBeDefined()
        expect(vault?.getCredentials.length).toBe(2)
        const updatedCredential = vault?.getCredentialById(credId)
        expect(updatedCredential).toBeDefined()
        expect(updatedCredential?.getSecret).toBe(encryptData('updatedTestSecret'))
        expect(updatedCredential?.getDescription).toBe('test-service')
    })
})