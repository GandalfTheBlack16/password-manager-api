import { VaultEraser } from '../../../src/vault/application/VaultEraser';
import { VaultNotExistsException } from '../../../src/vault/application/exeptions/VaultNotExistsException';
import { Vault } from '../../../src/vault/domain/Vault';
import { VaultRepositoryStub } from './resources/vaultRepositoryStub';
import { v4 as uuid } from 'uuid';

describe('Vault delete use-case', () => {
    let vaultEraser: VaultEraser
    let vaultRepository: VaultRepositoryStub

    beforeEach(() => {
        vaultRepository = new VaultRepositoryStub()
        vaultEraser = new VaultEraser(vaultRepository)
    })

    it('should throw exception if vault does not exists', async () => {
        jest.spyOn(vaultRepository, 'deleteVaultById').mockResolvedValue(false)
        try {
            await vaultEraser.run('fakeId')
        } catch (error) {
            expect(vaultRepository.deleteVaultById).toHaveBeenCalledWith('fakeId')
            expect(error).toBeInstanceOf(VaultNotExistsException)
        }
    })

    it('should delete a vault', async () => {
        const selectedId = uuid()
        vaultRepository.mockedVaultList.push(
            new Vault(uuid(), 'user1'),
            new Vault(uuid(), 'user2'),
            new Vault(selectedId, 'selectedUser')
        )
        await vaultEraser.run(selectedId)
        expect(vaultRepository.mockedVaultList.length).toBe(2)
        expect(vaultRepository.mockedVaultList.find(i => i.getOwner === 'selectedUser')).toBeUndefined()
    })
})