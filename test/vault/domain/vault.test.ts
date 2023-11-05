import { IllegalArgException } from '../../../src/shared/domain/exception/IllegalArgException.js'
import { Vault } from '../../../src/vault/domain/Vault.js'
import { Credential } from '../../../src/vault/domain/Credential.js'
import { v4 as uuid } from 'uuid'

describe('Vault domain class', () => {
  it('should create a valid vault', () => {
    const expectedId = uuid()
    const expectedOwner = 'user'
    const vault = new Vault(expectedId, expectedOwner)
    expect(vault).toBeDefined()
    expect(vault.getId).toBe(expectedId)
    expect(vault.getOwner).toBe(expectedOwner)
    expect(vault.getCredentials.length).toBe(0)
  })

  it('should create a vault with lastModified', () => {
    const expectedId = uuid()
    const expectedOwner = 'user'
    const expectedDate = new Date()
    const vault = new Vault(expectedId, expectedOwner, expectedDate)
    expect(vault).toBeDefined()
    expect(vault.getId).toBe(expectedId)
    expect(vault.getOwner).toBe(expectedOwner)
    expect(vault.getLastModified).toBe(expectedDate)
    expect(vault.getCredentials.length).toBe(0)
  })

  it('should update lastModified', () => {
    const expectedId = uuid()
    const expectedOwner = 'user'
    const vault = new Vault(expectedId, expectedOwner)
    const currentDate = vault.getLastModified
    vault.addCredential(new Credential(uuid(), 'test', 'test-secret'))
    expect(vault.getLastModified).toBe(currentDate)
    vault.updateLastModified()
    expect(vault.getLastModified).not.toBe(currentDate)
  })

  it('should throw invalid id exception', () => {
    let vault
    expect(() => {
      vault = new Vault('fake-id', 'user')
    }).toThrow(IllegalArgException)

    expect(vault).toBeUndefined()
  })

  it('should add new credential', () => {
    const vault = new Vault(uuid(), 'user')
    const credential = new Credential(uuid(), 'name', 'service')
    vault.addCredential(credential)
    expect(vault.getCredentials.length).toBe(1)
    expect(vault.getCredentials.includes(credential)).toBeTruthy()
  })

  it('should get a credential by id', () => {
    const credId = uuid()
    const vault = new Vault(uuid(), 'user')
    vault.addCredential(new Credential(credId, 'name', 'secret'))
    const credential =  vault.getCredentialById(credId)
    expect(credential).toBeDefined()
    expect(credential?.getId).toBe(credId)
    expect(credential?.getName).toBe('name')
    expect(credential?.getSecret).toBe('secret')
    expect(credential?.getDescription).toBeUndefined()
  })

  it('should add a list of credentials', () => {
    const vault = new Vault(uuid(), 'user')
    const credId = uuid()
    const credentialList: Credential[] = [
      new Credential(uuid(), 'name1', 'secret1'),
      new Credential(uuid(), 'name2', 'secret2'),
      new Credential(credId, 'name3', 'secret3'),
      new Credential(uuid(), 'name4', 'secret4'),
    ]
    vault.addCredentials(credentialList)
    expect(vault.getCredentials.length).toBe(4)
    expect(vault.getCredentialById(credId)).toBeDefined()
    expect(vault.getCredentialById(credId)?.getName).toBe('name3')
    expect(vault.getCredentialById(credId)?.getSecret).toBe('secret3')
  })

  it('should delete a credential by id', () => {
    const vault = new Vault(uuid(), 'user')
    const credId = uuid()
    const credentials: Credential[] = [
      new Credential(uuid(), 'name1', 'secret1'),
      new Credential(credId, 'name2', 'secret2'),
      new Credential(uuid(), 'name3', 'secret3'),
      new Credential(uuid(), 'name4', 'secret4'),
    ]
    vault.addCredentials(credentials)
    let credential = vault.getCredentialById(credId)
    expect(credential).toBeDefined()
    expect(vault.getCredentials.length).toBe(4)
    vault.deleteCredentialById(credId)
    credential = vault.getCredentialById(credId)
    expect(credential).toBeUndefined()
    expect(vault.getCredentials.length).toBe(3)
  })

  it('should update a credential including a description if already exists', () => {
    const vault = new Vault(uuid(), 'user')
    const credId = uuid()
    vault.addCredentials([
      new Credential(uuid(), 'name1', 'secret1'),
      new Credential(uuid(), 'name2', 'secret2'),
      new Credential(credId, 'name3', 'secret3'),
      new Credential(uuid(), 'name4', 'secret4'),
    ])
    const updatedCredential = new Credential(credId, 'nameUpdated', 'secretUpdated', 'newDescription')
    vault.addCredential(updatedCredential)
    expect(vault.getCredentials.length).toBe(4)
    const credential = vault.getCredentialById(credId)
    expect(credential).toBeDefined()
    expect(credential?.getName).toBe('nameUpdated')
    expect(credential?.getSecret).toBe('secretUpdated')
    expect(credential?.getDescription).toBe('newDescription')
  })

  it('should updated a credential deleting its description', () => {
    const vault = new Vault(uuid(), 'user')
    const credId = uuid()
    vault.addCredentials([
      new Credential(uuid(), 'name1', 'secret1', 'description1'),
      new Credential(credId, 'name2', 'secret2', 'description2'),
      new Credential(uuid(), 'name3', 'secret3', 'description3'),
      new Credential(uuid(), 'name4', 'secret4', 'description4'),
    ])
    const updatedCredential = new Credential(credId, 'nameUpdated', 'secretUpdated')
    vault.addCredential(updatedCredential)
    expect(vault.getCredentials.length).toBe(4)
    const credential = vault.getCredentialById(credId)
    expect(credential).toBeDefined()
    expect(credential?.getName).toBe('nameUpdated')
    expect(credential?.getSecret).toBe('secretUpdated')
    expect(credential?.getDescription).toBeUndefined()
  })
})
