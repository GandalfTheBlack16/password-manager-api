import { VaultCredentialEraser } from '../../../src/vault/application/VaultCredentialEraser';
import { VaultRepositoryStub } from './resources/vaultRepositoryStub';
import { Vault } from '../../../src/vault/domain/Vault';
import { VaultNotExistsException } from '../../../src/vault/application/exceptions/VaultNotExistsException';
import { v4 as uuid } from 'uuid';
import { Credential } from '../../../src/vault/domain/Credential';
import { CredentialNotExistsException } from '../../../src/vault/application/exceptions/CredentialNotExistsException';
describe('Vault credential delete use-case', () => {

    let vaultCredentialEraser: VaultCredentialEraser
    let vaultRepository: VaultRepositoryStub

    beforeEach(() => {
        vaultRepository = new VaultRepositoryStub()
        vaultCredentialEraser = new VaultCredentialEraser(vaultRepository)
    })

    it('should return exception if vault does not exists', async () => {
        jest.spyOn(vaultRepository, 'findVaultById').mockResolvedValue(undefined)
        try {
            await vaultCredentialEraser.run({ vaultId: 'fakeVaultId', credentialId: 'credentialId' })
        } catch (error) {
            expect(vaultRepository.findVaultById).toHaveBeenCalled()
            expect(error).toBeInstanceOf(VaultNotExistsException)
        }
    })

    it('should return exception if credential does not exists', async () => {
        const mockedVault = new Vault(uuid(), 'user')
        mockedVault.addCredential(new Credential(uuid(), 'test', 'secret'))
        jest.spyOn(vaultRepository, 'findVaultById').mockResolvedValue(mockedVault)
        try {
            await vaultCredentialEraser.run({ vaultId: mockedVault.getId, credentialId: "fakeId" })
        } catch (error) {
            expect(vaultRepository.findVaultById).toHaveBeenCalled()
            expect(error).toBeInstanceOf(CredentialNotExistsException)
        }
    })

    it('should delete a credential from vault', async () => {
        const mockedVault = new Vault(uuid(), 'user')
        const selectedId = uuid()
        mockedVault.addCredentials([
            new Credential(uuid(), 'test', 'secret'),
            new Credential(selectedId, 'testToDelete', 'secret'),
            new Credential(uuid(), 'test', 'secret')
        ])
        jest.spyOn(vaultRepository, 'findVaultById').mockResolvedValue(mockedVault)
        const response = await vaultCredentialEraser.run({ vaultId: mockedVault.getId, credentialId: selectedId })
        expect(vaultRepository.findVaultById).toHaveBeenCalledWith(mockedVault.getId)
        expect(response.getCredentialById(selectedId)).toBeUndefined()
    })
})