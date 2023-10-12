import { IllegalArgException } from '../../../src/shared/domain/exception/IllegalArgException.js'
import { Vault, type Credential } from '../../../src/vault/domain/Vault.js'
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

  it('should throw invalid id exception', () => {
    let vault
    expect(() => {
      vault = new Vault('fake-id', 'user')
    }).toThrow(IllegalArgException)

    expect(vault).toBeUndefined()
  })

  it('should add new credential', () => {
    const vault = new Vault(uuid(), 'user')
    const credential: Credential = {
      name: 'name',
      secret: 'service',
      serviceName: 'secret'
    }
    vault.addCredential(credential)
    expect(vault.getCredentials.length).toBe(1)
    expect(vault.getCredentials.includes(credential)).toBeTruthy()
  })

  it('should add a list of credentials', () => {
    const vault = new Vault(uuid(), 'user')
    const credentialList: Credential[] = [
      { name: 'name', secret: 'service', serviceName: 'secret' },
      { name: 'name2', secret: 'service2', serviceName: 'secret2' },
      { name: 'name3', secret: 'service3', serviceName: 'secret3' },
      { name: 'name4', secret: 'service4', serviceName: 'secret4' }
    ]
    vault.addCredentials(credentialList)
    expect(vault.getCredentials.length).toBe(4)
    expect(vault.getCredentials.includes(credentialList[0])).toBeTruthy()
    expect(vault.getCredentials.includes(credentialList[1])).toBeTruthy()
    expect(vault.getCredentials.includes(credentialList[2])).toBeTruthy()
    expect(vault.getCredentials.includes(credentialList[3])).toBeTruthy()
  })

  it('should delete a credential by name', () => {
    const vault = new Vault(uuid(), 'user')
    const credentials: Credential[] = [
      { name: 'name', serviceName: 'service', secret: 'secret' },
      { name: 'name2', serviceName: 'service2', secret: 'secret' },
      { name: 'name3', serviceName: 'service3', secret: 'secret' }
    ]
    credentials.forEach(i => { vault.addCredential(i) })
    vault.deleteCredentialByName('name')
    expect(vault.getCredentials.length).toBe(2)
    expect(vault.getCredentials.includes({ name: 'name', secret: 'service', serviceName: 'secret' })).toBeFalsy()
  })

  it('should update service name and secret of a credential', () => {
    const vault = new Vault(uuid(), 'user')
    vault.addCredential({ name: 'name', serviceName: 'service', secret: 'secret' })
    vault.updateCredentialByName('name', { serviceName: 'updatedService', secret: 'updatedSecret' })
    const credential = vault.getCredentials[0]
    expect(credential).toBeDefined()
    expect(credential.name).toBe('name')
    expect(credential.serviceName).toBe('updatedService')
    expect(credential.secret).toBe('updatedSecret')
  })

  it('should update credential, including its name', () => {
    const vault = new Vault(uuid(), 'user')
    vault.addCredential({ name: 'name', serviceName: 'service', secret: 'secret' })
    vault.updateCredentialByName('name', { name: 'updatedName', serviceName: 'updatedService', secret: 'updatedSecret' })
    const credential = vault.getCredentials[0]
    expect(credential).toBeDefined()
    expect(credential.name).toBe('updatedName')
    expect(credential.serviceName).toBe('updatedService')
    expect(credential.secret).toBe('updatedSecret')
  })
})
